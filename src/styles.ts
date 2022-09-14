import { css, cx } from 'emotion';

export const main = cx(
	'bx--content',
	'bx--grid',
	css`
		padding-top: 0;
		background: #f4f4f4;
		min-height: calc(100vh - 1rem);
		max-width: unset;
`);

export const marginTop = (margin = '1rem') => css`margin-top: ${margin};`;
