import React from 'react';
import { OverflowMenu } from 'carbon-components-react';
import { renderComponents, setItemInState } from '../utils';
import { CssClasses } from '../types';
import { OverflowMenuItemState } from './ui-overflow-menu-item';

export interface OverflowMenuState {
	type: string;
	items: OverflowMenuItemState[];
	id: string | number;
	placement?: string;
	flipped?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIOverflowMenu = ({ state, setState, setGlobalState }: {
	state: OverflowMenuState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'overflow-menu') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <OverflowMenu
	direction={state.placement}
	flipped={state.flipped}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</OverflowMenu>;
};
