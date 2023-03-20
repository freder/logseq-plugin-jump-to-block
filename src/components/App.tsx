/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';

import React, { useEffect, useState } from 'react';
import CommandPalette, { Command } from 'react-command-palette';
import markdownToTxt from 'markdown-to-txt';

// @ts-ignore
import theme from '../../node_modules/react-command-palette/dist/themes/sublime-theme';
import '../../node_modules/react-command-palette/dist/themes/sublime.css';


const scrollTo = async (blockUuid: string) => {
	const page = await logseq.Editor.getCurrentPage();
	if (!page) { return; }
	logseq.Editor.scrollToBlockInPage(
		page.name, blockUuid
	);
};


const selectionHandler = (item: Record<string, unknown>) => {
	if (item) scrollTo(item.id as string);
};


const makeCommands = (
	blocks: BlockEntity[],
	maxDepth = Infinity
) => {
	const items: Command[] = [];
	const recurse = (block: BlockEntity, depth: number) => {
		if (depth > maxDepth) {
			return;
		}
		const cmd: Command = {
			// @ts-expect-error
			id: block.uuid,
			name: '—'.repeat(depth) + ' ' + markdownToTxt(block.content),
			command: () => scrollTo(block.uuid),
			color: 'transparent',
		};
		items.push(cmd);
		const children = block.children || [];
		if (children.length) {
			(children as BlockEntity[]).forEach(
				(block) => recurse(block, depth + 1)
			);
		}
	};
	blocks.forEach(
		(block) => recurse(block, 0)
	);
	return items;
};


function App() {
	const [open, setOpen] = useState(false);
	const [items, setItems] = useState<Command[]>([]);

	useEffect(
		() => {
			const visibilityHandler = async ({ visible }: { visible: boolean }) => {
				if (visible) {
					const blocks = await logseq.Editor.getCurrentPageBlocksTree();
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

	const closeHandler = () => {
		logseq.hideMainUI();
	};

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
		onHighlight={selectionHandler}
		onSelect={selectionHandler}
		onRequestClose={closeHandler}
	/>;
}

export default App;
