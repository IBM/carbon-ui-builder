import React from 'react';
import { TileBelowTheFoldContent } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface TileFoldState {
	type: string;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UITileFold = ({ state, setState, setGlobalState }: {
	state: TileFoldState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'tile-fold') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <TileBelowTheFoldContent
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</TileBelowTheFoldContent>;
};
