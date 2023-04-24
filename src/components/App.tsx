/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import type { InitalSelectionOption } from '../types';

import React, { useEffect, useState, Fragment } from 'react';
import CommandPalette, { Command } from 'react-command-palette';
import * as R from 'ramda';
import { Global, css } from '@emotion/react';

import { prepareLabel } from '../utils';

// @ts-ignore
import theme from '../../node_modules/react-command-palette/dist/themes/sublime-theme';
import '../../node_modules/react-command-palette/dist/themes/sublime.css';
import { defaultMaxDepth, initialSelectionDefault } from '../constants';


type PathItem = {
	uuid: string,
	collapsed: boolean,
};


const scrollTo = async (blockUuid: string) => {
	const pageOrBlock = (await logseq.Editor.getCurrentPage());
	const isBlock = ('content' in (pageOrBlock || {}));
	if (!pageOrBlock) {
		return console.error('failed to get page or block');
	}
	const page = isBlock
		? await logseq.Editor.getPage(pageOrBlock.page.id)
		: pageOrBlock;
	if (!page) {
		return console.error('failed to get page');
	}
	// TODO: how to scroll to block in sub-tree without leaving the sub-tree?
	// `scrollToBlockInPage()` will open the entire page
	logseq.Editor.scrollToBlockInPage(page.name, blockUuid);
};


const selectionHandler = async (
	item: Record<string, unknown>,
	expand: boolean,
) => {
	if (!item) {
		return;
	}
	if (expand) {
		await Promise.all(
			R.dropLast(1, item.path as PathItem[])
				.filter((pathItem) => pathItem.collapsed)
				.map(({ uuid }) => logseq.Editor.setBlockCollapsed(uuid, false))
		);
	}
	if (item) scrollTo(item.id as string);
};


const makeCommands = (
	blocks: BlockEntity[],
	maxDepth = Infinity
) => {
	const items: Command[] = [];
	const recurse = (
		block: BlockEntity,
		depth: number,
		path: Array<PathItem>
	) => {
		if (depth > maxDepth) {
			return;
		}
		const blockContent = (block.content || '').trim();

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
		items.push(cmd);
		const children = block.children || [];
		if (children.length) {
			(children as BlockEntity[]).forEach(
				(block) => recurse(
					block,
					depth + 1,
					[...path, {
						uuid: block.uuid,
						collapsed: block['collapsed?'],
					}]
				)
			);
		}
	};
	blocks.forEach(
		(block) => recurse(block, 0, [])
	);
	return items;
};


const makeStyles = () => {
	const computedStyles = getComputedStyle(
		window.parent.document.documentElement
	);
	const bg = computedStyles.getPropertyValue(
		'--ls-secondary-background-color'
	);
	const bgSelection = computedStyles.getPropertyValue(
		'--ls-a-chosen-bg'
	);
	const text = computedStyles.getPropertyValue(
		'--ls-primary-text-color'
	);
	const textSelection = computedStyles.getPropertyValue(
		'--ls-secondary-text-color'
	);
	const input = computedStyles.getPropertyValue(
		'--ls-primary-background-color'
	);
	return css`
		.sublime-modal, .sublime-suggestionsList .sublime-suggestion {
			background: ${bg} !important;
			color: ${text} !important;
		}
		.sublime-suggestionsList .sublime-suggestionHighlighted {
			background: ${bgSelection} !important;
			color: ${textSelection} !important;
		}
		.sublime-suggestion {
			background: ${bgSelection} !important;
		}
		.sublime-input {
			background: ${input} !important;
			color: ${text} !important;
		}
		*::-webkit-scrollbar-thumb {
			background-color: ${bgSelection} !important;
			border: solid 3px ${bg} !important;
		}
		.indentation {
			color: ${bgSelection} !important;
		}
	`;
};


function App() {
	const [open, setOpen] = useState(false);
	const [items, setItems] = useState<Command[]>([]);

	const closeHandler = () => {
		logseq.hideMainUI();
	};

	useEffect(
		() => {
			const visibilityHandler = async ({ visible }: { visible: boolean }) => {
				if (visible) {
					const pageOrBlock = await logseq.Editor.getCurrentPage();
					if (!pageOrBlock) {
						logseq.UI.showMsg('This page is not supported', 'warning');
						return closeHandler();
					}

					// NOTE: `logseq.Editor.getCurrentPageBlocksTree()` won't return anything if
					// we're in a sub-tree rather than a full page.
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
					const items = makeCommands(blocks, maxDepth);
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
		[]
	);

	const initialSelection: InitalSelectionOption = logseq.settings?.initialSelection || initialSelectionDefault;
	const highlightFirstSuggestion = initialSelection === 'First block';
	// TODO: implement 'Current block'
	const defaultInputValue = '';

	return <Fragment>
		<Global styles={makeStyles} />
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
