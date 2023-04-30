import { css } from '@emotion/react';


export const makeStyles = () => {
	const computedStyles = getComputedStyle(
		window.parent.document.documentElement
	);
	const bg = computedStyles.getPropertyValue(
		'--ls-secondary-background-color'
	);
	const bgSelection = computedStyles.getPropertyValue(
		'--ls-a-chosen-bg'
	);
	const text = computedStyles.getPropertyValue(
		'--ls-primary-text-color'
	);
	const textSelection = computedStyles.getPropertyValue(
		'--ls-secondary-text-color'
	);
	const input = computedStyles.getPropertyValue(
		'--ls-primary-background-color'
	);
	return css`
		.sublime-modal, .sublime-suggestionsList .sublime-suggestion {
			background: ${bg} !important;
			color: ${text} !important;
		}
		.sublime-suggestionsList .sublime-suggestionHighlighted {
			background: ${bgSelection} !important;
			color: ${textSelection} !important;
		}
		.sublime-suggestion {
			background: ${bgSelection} !important;
		}
		.sublime-input {
			background: ${input} !important;
			color: ${text} !important;
		}
		*::-webkit-scrollbar-thumb {
			background-color: ${bgSelection} !important;
			border: solid 3px ${bg} !important;
		}
		.indentation {
			color: ${bgSelection} !important;
		}
	`;
};
