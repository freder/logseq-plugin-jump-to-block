import type {
	SettingSchemaDesc,
	SimpleCommandKeybinding
} from '@logseq/libs/dist/LSPlugin';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '@logseq/libs';

import { makeToolbarIcon } from './toolbar';
import App from './components/App';


const cmdKey = 'jumpToBlock';
const cmdLabel = 'Jump to block…';
const settingsKey = cmdKey;
const settingsLabel = cmdLabel;
const settings: SettingSchemaDesc[] = [
	{
		key: settingsKey,
		title: settingsLabel,
		description: 'Jump to a block within the current page',
		default: 'mod+t',
		type: 'string',
	},
	{
		key: 'autoOpen',
		title: 'Auto-open palette',
		description: 'Autmatically open the palette on opening a page',
		default: false,
		type: 'boolean',
	},
];


const main = async () => {
	if (!logseq) {
		console.error('`logseq` object not available');
		return;
	}

	logseq.useSettingsSchema(settings);

	const mount = document.getElementById('mount') as HTMLElement;
	const root = ReactDOM.createRoot(mount);
	root.render(
		// <React.StrictMode>
		<App />
		// </React.StrictMode>
	);

	// auto open
	const PageSet = new Set();
	logseq.App.onRouteChanged(async (event) => {
		const autoOpen = logseq.settings?.autoOpen || '';
		if (autoOpen === true) {
			if (event && event.template === '/page/:name') {
				if (!PageSet.has(event.path)) {
					PageSet.clear();
					logseq.showMainUI({ autoFocus: false });
				}
				await PageSet.add(event.path);
			}
		}
	});

	// toolbar icon
	logseq.App.registerUIItem(
		'toolbar',
		{
			key: 'jump-to-block',
			// TODO: add icon
			template: `${makeToolbarIcon(cmdLabel)}\n`,
		}
	);

	const keyBinding: SimpleCommandKeybinding = {
		// mode: 'editing', // 'global' | 'non-editing'
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		binding: logseq.settings![settingsKey],
	};

	logseq.App.registerCommandPalette(
		{
			key: cmdKey,
			label: cmdLabel,
			keybinding: keyBinding,
		},
		async () => {
			logseq.showMainUI({ autoFocus: false });
		}
	);
};

const model = {
	toolbarJumpToBlock() {
		logseq.showMainUI({ autoFocus: false });
	}
};

logseq.ready(model, main).catch(console.error);
