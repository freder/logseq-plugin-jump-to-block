import '@logseq/libs';


const main = async () => {
	console.log('here');
	logseq.App.registerCommandPalette(
		// 'test',
		{
			key: 'xxxTest',
			label: 'XXX test',
			// desc: 'test description',
			// palette?: booleanString,
			// keybinding?: SimpleCommandKeybindingString,
		},
		async () => {
			const page = await logseq.Editor.getCurrentPage();
			const blocks = await logseq.Editor.getPageBlocksTree(page?.name);
			console.log(blocks);
		}
	)
};


logseq.ready(main).catch(console.error);
