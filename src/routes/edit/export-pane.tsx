import React from 'react';
import { cx } from 'emotion';
import { leftPane } from '.';

export const ExportPane = ({ isActive }: any) => {
	return (
		<div className={cx(leftPane, isActive ? 'is-active' : '')}>
			Export
			<br /><br /> <strong>Comming soon!</strong>
		</div>
	);
};
