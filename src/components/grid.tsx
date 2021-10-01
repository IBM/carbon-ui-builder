// TODO: Delete this when the carbon grid components are actually available
import React, { PropsWithChildren } from 'react';
import { cx } from 'emotion';

export type RowProps = PropsWithChildren<{
	styles?: any
}>;

export const Row = ({ styles, children }: RowProps) => (
	<div className={cx('bx--row', styles)}>{children}</div>
);

export interface ColDefinition {
	sm?: number;
	md?: number;
	lg?: number;
}

export type ColProps = PropsWithChildren<{
	cols?: ColDefinition,
	render?: (props: PropsWithChildren<any>) => JSX.Element
}>;

export const Col = ({ cols, render, children }: ColProps) => {
	const baseRender = render ?? ((props) => <div {...props} />);
	const classes = cx({
		[`bx--col-sm-${cols?.sm}`]: !!cols?.sm ?? false,
		[`bx--col-md-${cols?.md}`]: !!cols?.md ?? false,
		[`bx--col-lg-${cols?.lg}`]: !!cols?.lg ?? false,
		'bx--col': !!cols
	});
	return baseRender({
		className: classes,
		children
	});
};
