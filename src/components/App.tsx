import type { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import CommandPalette, { Command } from 'react-command-palette';


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
	props.blocks.forEach((block) => {
		const cmd: Command = {
			// @ts-expect-error
			id: block.uuid,
			name: block.content,
			command: () => scrollTo(block.uuid),
			color: 'transparent',
		};
		items.push(cmd);
	});

	return <div>
		<CommandPalette
			open
			closeOnSelect
			highlightFirstSuggestion
			hotKeys={[]}
			commands={items}
			onHighlight={(suggestion) => {
				scrollTo(suggestion.id as string);
			}}
			onRequestClose={() => {
				logseq.hideMainUI();
			}}
		/>
	</div>;
}

export default App
