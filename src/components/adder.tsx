import React from 'react';
import { Add16 } from '@carbon/icons-react';
import { css, cx } from 'emotion';

const addStyle = css`
	position: absolute;
	margin-top: -2px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
	z-index: 1;
`;

const addStyleTop = cx(addStyle, css`
	margin-top: -18px;
`);

const iconStyle = css`
	height: 1rem;
	width: 1rem;
	float: right;
	cursor: pointer`;

export const Adder = ({ active, topAction, bottomAction, children }: any) => <>
	<span className={cx(addStyleTop, active ? css`` : css`display: none`)}>
		<Add16
			onClick={(event: any) => {
				event.stopPropagation();
				topAction()
			}}
			className={iconStyle} />
	</span>
	{children}
	<span className={cx(addStyle, active ? css`` : css`display: none`)}>
		<Add16
			onClick={(event: any) => {
				event.stopPropagation();
				bottomAction()
			}}
			className={iconStyle} />
	</span>
</>;
