import React from 'react';
import { ClickableTile } from 'carbon-components-react';
import { CssClasses } from '../types';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface ClickableTileState {
	type: string;
	id: string | number;
	light?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'clickable-tile';

export const signals = ['click'];

export const slots = {
	...commonSlots,
	...slotsDisabled
};

export const UIClickableTile = ({ state, setState, setGlobalState, sendSignal }: {
	state: ClickableTileState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'clickable-tile') {
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

	return <ClickableTile
	light={state.light}
	disabled={state.disabled}
	onClick={() => sendSignal(state.id, 'click')}
	className={cssClasses}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</ClickableTile>;
};
