import '@logseq/libs';
import type { SettingSchemaDesc, SimpleCommandKeybinding } from '@logseq/libs/dist/LSPlugin';


const main = async () => {
	console.log('here');
	if (!logseq) {
		console.error('`logseq` object not available');
		return;
	}

	const settings: SettingSchemaDesc[] = [
		{
			key: "goToSymbol",
			title: 'Go to symbol...',
			description: "Jump to a heading within the current page",
			default: "mod+t",
			type: "string",
		},
	];
	logseq.useSettingsSchema(settings);

	const keyBinding: SimpleCommandKeybinding = {
		// mode: 'editing', // 'global' | 'non-editing'
		binding: logseq.settings!.goToSymbol,
		// mac?: string;
	};

	// logseq.App.registerCommand(
	// 	"goToSymbol",
	// 	{
	// 		key: "goToSymbol",
	// 		label: 'Go to symbol...',
	// 		keybinding: keyBinding,
	// 	},
	// 	(err) => {
	// 		console.error(err);
	// 	}
	// );

	logseq.App.registerCommandPalette(
		{
			key: 'goToSymbol',
			label: 'Go to symbol...',
			keybinding: keyBinding,
		},
		async () => {
			const page = await logseq.Editor.getCurrentPage();
			if (!page) {
				return;
			}
			const blocks = await logseq.Editor.getPageBlocksTree(page.name);
			console.log(blocks);
		}
	)
};


logseq.ready(main).catch(console.error);
