import type { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import CommandPalette, { Command } from 'react-command-palette';

// @ts-ignore
import theme from "../../node_modules/react-command-palette/dist/themes/sublime-theme";
import "../../node_modules/react-command-palette/dist/themes/sublime.css";


function App(props: {
	blocks: BlockEntity[]
}) {
	const scrollTo = async (blockUuid: string) => {
		const page = await logseq.Editor.getCurrentPage();
		if (!page) { return; }
		logseq.Editor.scrollToBlockInPage(
			page.name, blockUuid
		);
	}

	const items: Command[] = [];
	const recurse = (block: BlockEntity, depth: number) => {
		const cmd: Command = {
			// @ts-expect-error
			id: block.uuid,
			name: '—'.repeat(depth) + ' ' + block.content,
			command: () => scrollTo(block.uuid),
			color: 'transparent',
		};
		items.push(cmd);
		if (depth > 3) {
			return;
		}
		const children = block.children || [];
		if (children.length) {
			(children as BlockEntity[]).forEach(
				(block) => recurse(block, depth + 1)
			);
		}
	};
	props.blocks.forEach(
		(block) => recurse(block, 0)
	);

	return <div>
		<CommandPalette
			open
			closeOnSelect
			highlightFirstSuggestion
			hotKeys={[]}
			theme={theme}
			commands={items}
			onHighlight={(item) => {
				if (item) scrollTo(item.id as string);
			}}
			onSelect={(item) => {
				if (item) scrollTo(item.id as string);
			}}
			onRequestClose={() => {
				logseq.hideMainUI();
			}}
		/>
	</div>;
}

export default App
