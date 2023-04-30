/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import type { InitalSelectionOption, ModeOption } from '../types';

import React, { useEffect, useState, Fragment } from 'react';
import CommandPalette, { Command } from 'react-command-palette';
import * as R from 'ramda';
import { Global } from '@emotion/react';

import { prepareLabel } from '../utils';
import { makeStyles } from '../utils/theme';
import {
	defaultMaxDepth,
	headingRegex,
	initialSelectionDefault,
	modeDefault
} from '../constants';

// @ts-ignore
import theme from '../../node_modules/react-command-palette/dist/themes/sublime-theme';
import '../../node_modules/react-command-palette/dist/themes/sublime.css';


type PathItem = {
	uuid: string,
	collapsed: boolean,
};


const scrollTo = async (blockUuid: string) => {
	// we're not using `logseq.Editor.scrollToBlockInPage`
	// as it only works on pages and not in zoomed in views.
	// custom solution: scroll to the block and select it.

	// for reference: https://github.com/logseq/logseq/blob/0.9.4/libs/src/LSPlugin.user.ts#L368
	const id = 'block-content-' + blockUuid;
	const elem = window.parent.document.getElementById(id);
	if (elem) {
		elem.scrollIntoView({ behavior: 'smooth' });
		// @ts-expect-error
		window.parent.logseq.api.select_block(blockUuid);
	} else {
		// this happens for children of collapsed blocks
		// console.error('failed to find block element');
	}
};


const selectionHandler = async (
	item: Record<string, unknown>,
	expand: boolean,
) => {
	if (!item) {
		return;
	}
	if (expand) {
		const collapsedItems = (item.path as PathItem[])
			.filter((pathItem) => pathItem.collapsed);
		for (const item of collapsedItems) {
			await logseq.Editor.setBlockCollapsed(item.uuid, false);
		}
	}
	scrollTo(item.id as string);
	// TODO: push state?
};


const makeCommands = (
	blocks: BlockEntity[],
	mode: ModeOption,
	maxDepth = Infinity
) => {
	const entries: Command[] = [];

	const recurse = (
		block: BlockEntity,
		depth: number,
		path: Array<PathItem>
	) => {
		if (mode === 'Default') {
			if (depth > maxDepth) {
				return;
			}
		}

		const blockContent = (block.content || '').trim();

		if (mode === 'Headings-only') {
			// ignore non-headings
			if (!headingRegex.test(blockContent)) {
				return;
			}
			const level = R.takeWhile(
				(c) => c === '#',
				blockContent.split('')
			).length;
			if (level > maxDepth) {
				return;
			}
		}

		// ignore empty blocks
		if (blockContent === '') { return; }

		// ignore horizontal lines
		if (blockContent === '---') { return; }

		const cmd: Command = {
			// @ts-expect-error
			id: block.uuid,
			name: prepareLabel(blockContent),
			command: () => scrollTo(block.uuid),
			color: 'transparent',
			path: path,
		};
		entries.push(cmd);

		const children = block.children || [];
		if (children.length) {
			const parentPathItem: PathItem = {
				uuid: block.uuid,
				collapsed: block['collapsed?'],
			};
			(children as BlockEntity[]).forEach(
				(child) => recurse(
					child,
					depth + 1,
					[...path, parentPathItem]
				)
			);
		}
	};

	blocks.forEach(
		(block) => recurse(block, 0, [])
	);
	return entries;
};


function App() {
	const mode: ModeOption = logseq.settings?.mode || modeDefault;

	const [open, setOpen] = useState(false);
	const [items, setItems] = useState<Command[]>([]);

	const closeHandler = () => {
		logseq.hideMainUI();
	};

	logseq.Editor.getAllPages().then(async (allPages) => {
		const journalPages_ = allPages?.filter(
			(page) => page['journal?'] === true
		) || [];
		console.log(journalPages_);
		// let journalPages: BlockEntity[] = [];
		for (const page of journalPages_) {
			// this does not seem to include children!
			// const blocks = await logseq.Editor.getPage(
			// 	page.uuid,
			// 	{ includeChildren: true }
			// );

			const pageBlocks = await logseq.Editor.getPageBlocksTree(page.uuid);
			console.log(pageBlocks);
		}
	});

	useEffect(
		() => {
			const visibilityHandler = async ({ visible }: { visible: boolean }) => {
				if (visible) {
					const block = await logseq.Editor.getCurrentBlock();
					if (block) {
						console.log(block.page);
					}

					const pageOrBlock = await logseq.Editor.getCurrentPage();
					if (!pageOrBlock) {
						logseq.UI.showMsg('This page is not supported', 'warning');
						return closeHandler();
					}

					// `getCurrentPageBlocksTree()` won't return anything
					// if we're in a sub-tree rather than a full page.
					let blocks: BlockEntity[] = [];
					if ('content' in pageOrBlock) {
						const block = await logseq.Editor.getBlock(
							(pageOrBlock as BlockEntity).uuid,
							{ includeChildren: true }
						);
						if (block) {
							blocks = [block];
						}
					} else {
						blocks = await logseq.Editor.getCurrentPageBlocksTree();
					}
					if ((blocks || []).length === 0) {
						return closeHandler();
					}

					const maxDepth: number = Math.max(
						0,
						logseq.settings?.maxDepth || defaultMaxDepth
					);
					const items = makeCommands(blocks, mode, maxDepth);
					setItems(items);
					setOpen(true);
				} else {
					setOpen(false);
					setItems([]);
				}
			};
			logseq.on('ui:visible:changed', visibilityHandler);
			return () => {
				logseq.off('ui:visible:changed', visibilityHandler);
			};
		},
		[mode]
	);

	const initialSelection: InitalSelectionOption = logseq.settings?.initialSelection || initialSelectionDefault;
	const highlightFirstSuggestion = initialSelection === 'First block';
	// TODO: implement 'Current block'
	const defaultInputValue = '';

	return <Fragment>
		<Global styles={makeStyles()} />
		<CommandPalette
			open={open}
			closeOnSelect
			alwaysRenderCommands
			highlightFirstSuggestion={highlightFirstSuggestion}
			defaultInputValue={defaultInputValue}
			resetInputOnOpen
			placeholder="Type to filter…"
			hotKeys={[]}
			trigger={null}
			theme={theme}
			commands={items}
			maxDisplayed={500} // hard max. limit
			onHighlight={(item) => selectionHandler(item, false)}
			onSelect={(item) => selectionHandler(item, true)}
			onRequestClose={closeHandler}
			renderCommand={(cmd) => {
				// @ts-expect-error
				const depth = cmd.path.length;
				return <div>
					<span className='indentation'>{'—'.repeat(depth)}</span>
					{' '}{cmd.name}
				</div>;
			}}
		/>
	</Fragment>;
}

export default App;
