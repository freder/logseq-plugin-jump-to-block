import type {
	SettingSchemaDesc,
	SimpleCommandKeybinding
} from '@logseq/libs/dist/LSPlugin';
import type { InitalSelectionOption } from './types';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '@logseq/libs';

import { makeToolbarIcon } from './toolbar';
import { defaultMaxDepth, initialSelectionOptionDefault } from './constants';
import App from './components/App';



const cmdKey = 'jumpToBlock';
const cmdLabel = 'Jump to block…';
const settingsKey = cmdKey;
const settingsLabel = cmdLabel;
const initialSelectionOptions: InitalSelectionOption[] = [
	/* 'Current block', */ 'First block', 'Nothing'
];
const settings: SettingSchemaDesc[] = [
	{
		key: settingsKey,
		title: settingsLabel,
		description: 'Keybinding',
		default: 'mod+t',
		type: 'string',
	},
	{
		key: 'autoOpen',
		title: 'Auto-open palette',
		description: 'Automatically open the palette on opening a page',
		default: false,
		type: 'boolean',
	},
	{
		key: 'initialSelection',
		title: 'What to select when opening the palette',
		description: '',
		default: initialSelectionOptionDefault,
		type: 'enum',
		enumChoices: initialSelectionOptions as string[],
		enumPicker: 'radio',
	},
	{
		key: 'maxDepth',
		title: 'Maximum block depth',
		description: 'Limits the depth of blocks to be shown in the palette (0 = root-level)',
		default: defaultMaxDepth,
		type: 'number',
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

	// auto open palette when opening a page
	let pagePath = '';
	logseq.App.onRouteChanged(async (event) => {
		const autoOpen = logseq.settings?.autoOpen || '';
		if (autoOpen === true) {
			if (event.template === '/page/:name') {
				if (pagePath !== event.path) {
					logseq.showMainUI({ autoFocus: false });
				}
				pagePath = event.path;
			}
		}
	});

	// toolbar icon
	logseq.App.registerUIItem(
		'toolbar',
		{
			key: 'jump-to-block',
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
