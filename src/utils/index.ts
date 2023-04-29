import markdownToTxt from 'markdown-to-txt';


export const cleanLabel = (s: string) => {
	return s
		// collapsed:: true
		// id:: 643135d6-33b2-4aea-a78c-e6b3e0ce0f80
		.replaceAll(/^[\w_-]+::\W+.*$/gmi, '')
		// {:width 400}
		.replaceAll(/\{:.*\}/gi, '')
		.replaceAll(/^(TODO|DOING|DONE|NOW|LATER) /g, '')
		.trim();
}


export const prepareLabel = (blockContent: string) => {
	return cleanLabel(markdownToTxt(blockContent));
};
