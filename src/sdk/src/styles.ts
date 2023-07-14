// NOTE Styles will move to a separate SCSS library TODO
import { css } from 'emotion';

export const actionIconStyle = css`
	color: black;

	.bx--btn--ghost:disabled & {
		color: #8d8d8d;
	}
`;
