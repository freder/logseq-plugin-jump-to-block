/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';

import React, { useEffect, useState } from 'react';
import CommandPalette, { Command } from 'react-command-palette';
import markdownToTxt from 'markdown-to-txt';
import * as R from 'ramda';

// @ts-ignore
import theme from '../../node_modules/react-command-palette/dist/themes/sublime-theme';
import '../../node_modules/react-command-palette/dist/themes/sublime.css';


type PathItem = {
	uuid: string,
	collapsed: boolean,
};


const scrollTo = async (blockUuid: string) => {
	const page = await logseq.Editor.getCurrentPage();
	if (!page) {
		return console.error('failed to get current page');
	}
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


const prepareLabel = (blockContent: string) => {
	return markdownToTxt(blockContent)
		// ::collapsed true
		.replaceAll(/[^\W\n]+::\W[^\W]+/gmi, '')
		// {:width 400}
		.replaceAll(/\{:.*\}/gmi, '')
		.trim();
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
		if (blockContent === '') {
			return;
		}
		const cmd: Command = {
			// @ts-expect-error
			id: block.uuid,
			name: '—'.repeat(depth) + ' ' + prepareLabel(blockContent),
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
					const blocks = await logseq.Editor.getCurrentPageBlocksTree();
					if ((blocks || []).length === 0) {
						return closeHandler();
					}
					const maxDepth = 3; // TODO: make this configurable
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

	return <CommandPalette
		open={open}
		closeOnSelect
		alwaysRenderCommands
		highlightFirstSuggestion
		resetInputOnOpen
		placeholder="Type to filter..."
		hotKeys={[]}
		trigger={null}
		theme={theme}
		commands={items}
		maxDisplayed={500} // hard max. limit
		onHighlight={(item) => selectionHandler(item, false)}
		onSelect={(item) => selectionHandler(item, true)}
		onRequestClose={closeHandler}
	/>;
}

export default App;
