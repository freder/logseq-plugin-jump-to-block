import markdownToTxt from 'markdown-to-txt';


export const prepareLabel = (blockContent: string) => {
	return markdownToTxt(blockContent)
		// collapsed:: true
		// id:: 643135d6-33b2-4aea-a78c-e6b3e0ce0f80
		.replaceAll(/^[\w_-]+::\W+([\w_-])+/gmi, '')
		// {:width 400}
		.replaceAll(/\{:.*\}/gi, '')
		.replaceAll(/^(TODO|DOING|DONE|NOW|LATER) /g, '')
		.trim();
};
