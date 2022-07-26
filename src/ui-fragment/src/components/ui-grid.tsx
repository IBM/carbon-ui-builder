import React from 'react';
import { Grid } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface GridState {
	type: string;
	items: any[]; // TODO row type
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIGrid = ({ state, setState, setGlobalState }: {
	state: GridState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'grid') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Grid className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</Grid>;
};
