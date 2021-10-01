import React from 'react';
import { cx } from 'emotion';
import { leftPane } from '.';

export const StylePane = ({isActive}: any) => {
	return (
		<div className={cx(leftPane, isActive ? 'is-active' : '')}>
			Style
			<br /><br /> <strong>Comming soon!</strong>
		</div>
	);
};
