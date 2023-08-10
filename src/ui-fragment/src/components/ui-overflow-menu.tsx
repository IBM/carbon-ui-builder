import React from 'react';
import { OverflowMenu } from 'carbon-components-react';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';
import { CssClasses } from '../types';
import { OverflowMenuItemState } from './ui-overflow-menu-item';

export interface OverflowMenuState {
	type: string;
	items: OverflowMenuItemState[];
	id: string | number;
	placement?: string;
	flipped?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UIOverflowMenu = ({ state, setState, setGlobalState, sendSignal }: {
	state: OverflowMenuState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'overflow-menu') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	let cssClasses = state.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (state.style) {
		if (cssClasses.length > 0) {
			cssClasses += ' ';
		}
		cssClasses += stringToCssClassName(state.codeContext.name);
	}

	return <OverflowMenu
	direction={state.placement}
	flipped={state.flipped}
	className={cssClasses}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</OverflowMenu>;
};
