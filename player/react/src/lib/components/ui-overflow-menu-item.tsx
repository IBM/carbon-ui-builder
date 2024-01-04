import React from 'react';
import { OverflowMenuItem } from '@carbon/react';
import { CssClasses } from '../types';
import { commonSlots } from '../common-slots';

export interface OverflowMenuItemState {
	type: string;
	itemText: string;
	hasDivider?: boolean;
	link?: string;
	isDelete?: boolean;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const type = 'overflow-menu-item';

export const slots = {
	...commonSlots
};

export const UIOverflowMenuItem = ({ state }: {
	state: OverflowMenuItemState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
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
