import React from 'react';
import { css } from 'emotion';

import { SelectableTile } from 'carbon-components-react';

const tileFooter = css`
	position: absolute;
	display: flex;
	width: 100%;
	justify-content: space-between;
	bottom: 15px;
	p {
		font-weight: bold;
	}
	span {
		margin-right: 30px;
	}
`;

export interface SelectionTile {
	styles?: any,
	onChange?: any,
	icon?: JSX.Element | null,
	label?: string,
	selected?: boolean,
	tag?: JSX.Element | null
}

export const SelectionTile = (props: SelectionTile) => (
	<div className={props.styles}>
		<SelectableTile
			light={true}
			onChange={() => {props.onChange();}}
			selected={props.selected}>
			{ props.icon }
			<div className={tileFooter}>
				<p>{ props.label }</p>
				{ props.tag }
			</div>
		</SelectableTile>
	</div>
);
