import React from 'react';
import { cx } from 'emotion';
import { leftPane, leftPaneContent } from '.';

export const CodePane = ({ isActive }: any) => {
	return (
		<div className={cx(leftPane, leftPaneContent, isActive ? 'is-active' : '')}>
			Code
			<br /><br /> <strong>Comming soon!</strong>
		</div>
	);
};
