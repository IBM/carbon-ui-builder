import React from 'react';
import { Add16 } from '@carbon/icons-react';
import { css, cx } from 'emotion';

const addStyle = css`
	position: absolute;
	margin-top: -2px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
	z-index: 1000;
`;

const addStyleTop = cx(addStyle, css`
	margin-top: -18px;
`);

const addStyleRight = cx(addStyle, css`
	right: 0;
	margin-right: -21px;
`);

const addStyleLeft = cx(addStyle, css`
	left: 0;
	margin-left: -21px;
`);

const iconStyle = css`
	height: 1rem;
	width: 1rem;
	float: right;
	cursor: pointer;
`;

export const Adder = ({
	active,
	children,
	topAction,
	bottomAction,
	leftAction,
	rightAction,
	addButtonsCss
}: any) => <>
	{
		active && topAction && <span className={cx(addStyleTop, addButtonsCss)}>
			<Add16
				onClick={(event: any) => {
					event.stopPropagation();
					topAction();
				}}
				className={iconStyle} />
		</span>
	}
	{
		active && leftAction && <span className={cx(addStyleLeft, addButtonsCss)}>
			<Add16
				onClick={(event: any) => {
					event.stopPropagation();
					leftAction();
				}}
				className={iconStyle} />
		</span>
	}
	{
		active && rightAction && <span className={cx(addStyleRight, addButtonsCss)}>
			<Add16
				onClick={(event: any) => {
					event.stopPropagation();
					rightAction();
				}}
				className={iconStyle} />
		</span>
	}
	{children}
	{
		active && bottomAction && <span className={cx(addStyle, addButtonsCss)}>
			<Add16
				onClick={(event: any) => {
					event.stopPropagation();
					bottomAction();
				}}
				className={iconStyle} />
		</span>
	}
</>;
