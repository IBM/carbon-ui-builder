import React from 'react';
import { Tile } from '@carbon/react';
import { CssClasses } from '../types';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';
import { commonSlots } from '../common-slots';

export interface TileState {
	type: string;
	light?: boolean;
	items?: any[];
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'tile';

export const slots = {
	...commonSlots
};

export const UITile = ({ state, setState, setGlobalState, sendSignal }: {
	state: TileState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'tile') {
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

	return <Tile
	light={state.light}
	className={cssClasses}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</Tile>;
};
