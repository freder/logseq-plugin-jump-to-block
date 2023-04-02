import markdownToTxt from 'markdown-to-txt';


export const prepareLabel = (blockContent: string) => {
	return markdownToTxt(blockContent)
		// ::collapsed true
		.replaceAll(/[^\W\n]+::\W[^\W]+/gmi, '')
		// {:width 400}
		.replaceAll(/\{:.*\}/gmi, '')
		.replaceAll(/^(TODO|DOING|DONE) /gmi, '')
		.trim();
};
