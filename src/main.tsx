import type { BlockEntity, SettingSchemaDesc, SimpleCommandKeybinding } from '@logseq/libs/dist/LSPlugin';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '@logseq/libs';

import App from './components/App';


const main = async () => {
	if (!logseq) {
		console.error('`logseq` object not available');
		return;
	}

	const model = {
		show: (blocks: BlockEntity[]) => {
			ReactDOM.createRoot(mount).render(
				// <React.StrictMode>
				<App blocks={blocks} />
				// </React.StrictMode>
			);
			logseq.showMainUI();
		},
	};
	// logseq.provideModel(model);

	const mount = document.getElementById('mount') as HTMLElement;

	logseq.on("ui:visible:changed", async ({ visible }) => {
		if (!visible) {
			mount.style.display = 'none';
			mount.innerHTML = "";
		}
	})

	const settings: SettingSchemaDesc[] = [
		{
			key: "goToSymbol",
			title: 'Go to symbol...',
			description: "Jump to a block within the current page",
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

	logseq.App.registerCommandPalette(
		{
			key: 'goToSymbol',
			label: 'Go to symbol...',
			keybinding: keyBinding,
		},
		async () => {
			const blocks = await logseq.Editor.getCurrentPageBlocksTree();
			model.show(blocks);
		}
	)
};


logseq.ready(main).catch(console.error);
