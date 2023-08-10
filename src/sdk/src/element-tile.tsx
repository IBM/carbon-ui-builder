import React from 'react';
import { css } from 'emotion';
import { drag } from './tools';

const elementTileStyle = css`
	border: 1px solid #d8d8d8;
	min-width: 127px;
	width: 127px;
	height: 127px;
	display: inline-flex;
	margin-bottom: 1rem;
	flex-direction: column;

	img {
		margin: auto;
	}

	.title {
		text-align: center;
		width: 100%;
		margin: 0 1rem auto auto;
		overflow-wrap: break-word;
	}
`;

export const ElementTile = ({ children, componentObj }: any) => {
	return (<div
		className={elementTileStyle}
		draggable='true'
		onDragStart={(event: any) => drag(event, {
			component: componentObj
		})}>
		{children}
	</div>);
};
