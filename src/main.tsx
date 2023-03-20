import type {
	BlockEntity,
	SettingSchemaDesc,
	SimpleCommandKeybinding
} from '@logseq/libs/dist/LSPlugin';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '@logseq/libs';

import App from './components/App';


const cmdKey = 'goToSymbol';
const cmdLabel = 'Go to symbol...';
const settingsKey = 'goToSymbol';
const settingsLabel = 'Go to symbol...';
const settings: SettingSchemaDesc[] = [
	{
		key: settingsKey,
		title: settingsLabel,
		description: 'Jump to a block within the current page',
		default: 'mod+t',
		type: 'string',
	},
];


const main = async () => {
	if (!logseq) {
		console.error('`logseq` object not available');
		return;
	}

	logseq.useSettingsSchema(settings);

	const keyBinding: SimpleCommandKeybinding = {
		// mode: 'editing', // 'global' | 'non-editing'
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		binding: logseq.settings![settingsKey],
	};

	const mount = document.getElementById('mount') as HTMLElement;
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

	logseq.on('ui:visible:changed', async ({ visible }) => {
		if (!visible) {
			mount.style.display = 'none';
			mount.innerHTML = '';
		}
	});

	logseq.App.registerCommandPalette(
		{
			key: cmdKey,
			label: cmdLabel,
			keybinding: keyBinding,
		},
		async () => {
			const blocks = await logseq.Editor.getCurrentPageBlocksTree();
			model.show(blocks);
		}
	);
};


logseq.ready(main).catch(console.error);
