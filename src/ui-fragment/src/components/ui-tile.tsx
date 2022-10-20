import React from 'react';
import { Tile } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface TileState {
	type: string;
	light?: boolean;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UITile = ({ state, setState, setGlobalState }: {
	state: TileState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'tile') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Tile
	light={state.light}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</Tile>;
};
