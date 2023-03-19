import type { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';

import { useState } from 'react';
import CommandPalette, { filterItems, getItemIndex, JsonStructureItem } from 'react-cmdk';
import 'react-cmdk/dist/cmdk.css';


function App(props: {
	blocks: BlockEntity[]
}) {
	console.log(props.blocks);
	const [page, setPage] = useState('root');
	const [open, setOpen] = useState<boolean>(true);
	const [search, setSearch] = useState('');

	const scrollTo = async (blockUuid: string) => {
		const page = await logseq.Editor.getCurrentPage();
		if (!page) { return; }
		logseq.Editor.scrollToBlockInPage(
			page.name, blockUuid
		);
	}

	const items: JsonStructureItem[] = [];
	props.blocks.forEach((block) => {
		items.push({
			id: block.uuid.toString(),
			children: block.content,
			closeOnSelect: true,
			onClick: () => scrollTo(block.uuid),
		})
	});

	const entries = filterItems(
		[{
			id: 'toc',
			items: items,
			// [
			// 	{
			// 		id: "test",
			// 		children: "test",
			// 		// icon: "RectangleStackIcon",
			// 		closeOnSelect: true,
			// 		onClick: () => {
			// 			// logseq.Editor.scrollToBlockInPage();
			// 		},
			// 	},
			// ]
		}],
		search
	);

	return <div>
		<CommandPalette
			onChangeSearch={setSearch}
			onChangeOpen={(open) => {
				if (!open) {
					logseq.hideMainUI()
				}
				setOpen(open);
			}}
			// onChangeSelected={(idx: number) => {
			// 	logseq.UI.showMsg(idx.toString());
			// 	scrollTo(items[idx].id);
			// }}
			// selected={0}
			search={search}
			isOpen={open}
			page={page}
		>
			<CommandPalette.Page id="root">
				{entries.map((list) => (
					<CommandPalette.List
						key={list.id}
						heading={list.heading}
					>
						{list.items.map(({ id, ...rest }) => (
							<CommandPalette.ListItem
								key={id}
								index={getItemIndex(entries, id)}
								{...rest}
							/>
						))}
					</CommandPalette.List>
				))}
			</CommandPalette.Page>
		</CommandPalette>
	</div>;
}

export default App
