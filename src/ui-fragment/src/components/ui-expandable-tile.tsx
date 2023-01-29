import React from 'react';
import { ExpandableTile, TileAboveTheFoldContent } from '@carbon/react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface ExpandableTileState {
	type: string;
	light?: boolean;
	expanded?: boolean;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

// Splits data into folds - all exports will have a common approach
export const getFoldObjects = (state: any) => {
	return {
		aboveFold: state.items.filter((item: any) => item.type !== 'tile-fold'),
		belowFold: state.items.filter((item: any) => item.type === 'tile-fold')
	};
};

export const UIExpandableTile = ({ state, setState, setGlobalState }: {
	state: ExpandableTileState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'expandable-tile') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	const { aboveFold, belowFold } = getFoldObjects(state);

	return <ExpandableTile
	light={state.light}
	expanded={state.expanded}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		<TileAboveTheFoldContent>
			{
				aboveFold?.map((item: any) => {
					const setItem = (i: any) => setItemInState(i, state, setState);
					return renderComponents(item, setItem, setGlobalState);
				})
			}
		</TileAboveTheFoldContent>
		{
			belowFold?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</ExpandableTile>;
};
