export const makeToolbarIcon = (cmdLabel: string) => {
	return `
		<div style="display: inline;">
			<button
				title="${cmdLabel}"
				class="button icon inline"
				data-on-click="toolbarJumpToBlock"
				style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;"
			>
				<span class="ui__icon" style="position:relative;left:1px;">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						xml:space="preserve"
						style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
					>
						<g transform="matrix(0.75,0,0,0.75,0,0)">
							<g id="Layer1">
								<rect x="0" y="0" width="32" height="32" style="fill-opacity:0;"/>
							</g>
						</g>
						<g transform="matrix(1,0,0,1,-1.7,-0.00739822)">
							<g transform="matrix(0.75,0,0,0.75,0.425,0.00184956)">
								<path d="M26,6C26,4.903 25.097,4 24,4L8,4C6.903,4 6,4.903 6,6L6,26C6,27.097 6.903,28 8,28L16,28L16,26L8,26L8,6L24,6L24,12L26,12L26,6Z" style="fill:currentColor;"/>
							</g>
							<g transform="matrix(0.75,0,0,0.75,0.425,0.00184956)">
								<rect x="10" y="18" width="6" height="2" style="fill:currentColor;"/>
							</g>
							<g transform="matrix(0.75,0,0,0.75,0.425,0.00184956)">
								<rect x="10" y="14" width="12" height="2" style="fill:currentColor;"/>
							</g>
							<g transform="matrix(0.75,0,0,0.75,0.425,0.00184956)">
								<rect x="10" y="10" width="12" height="2" style="fill:currentColor;"/>
							</g>
							<g transform="matrix(0.75,0,0,0.75,0.425,0.00184956)">
								<path d="M25,23L30,25L30,23L25,20.5L25,18C25,17.451 24.549,17 24,17C23.451,17 23,17.451 23,18L23,20.5L18,23L18,25L23,23L23,26.5L21,28L21,29L24,28L27,29L27,28L25,26.5L25,23Z" style="fill:currentColor;"/>
							</g>
						</g>
					</svg>
				</span>
			</button>
		</div>
	`;
};
