import React from 'react';
import { ClickableTile } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface ClickableTileState {
	type: string;
	light?: boolean;
	disabled?: boolean;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIClickableTile = ({ state, setState, setGlobalState }: {
	state: ClickableTileState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'clickable-tile') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <ClickableTile
	light={state.light}
	disabled={state.disabled}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</ClickableTile>;
};
