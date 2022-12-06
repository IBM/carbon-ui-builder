import React from 'react';
import { OverflowMenuItem } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface OverflowMenuItemState {
	type: string;
	itemText: string;
	hasDivider?: boolean;
	link?: string;
	isDelete?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIOverflowMenuItem = ({ state }: {
	state: OverflowMenuItemState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'overflow-menu-item') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <OverflowMenuItem
		key={state.itemText}
		itemText={state.itemText}
		hasDivider={state.hasDivider}
		href={state.link}
		isDelete={state.isDelete} />;
};
