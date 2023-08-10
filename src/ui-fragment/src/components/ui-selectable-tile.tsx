import React from 'react';
import { SelectableTile } from 'carbon-components-react';
import { CssClasses } from '../types';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';

export interface SelectableTileState {
	type: string;
	light?: boolean;
	items?: any[];
	standalone?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
		value?: string;
		title?: string;
		formItemName?: string;
	};
	style?: any;
}

export const UISelectableTile = ({ state, setState, setGlobalState, sendSignal }: {
	state: SelectableTileState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'selectable-tile') {
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

	return <SelectableTile
	light={state.light}
	id={state.codeContext?.name}
	value={state.codeContext?.value}
	name={state.codeContext?.formItemName !== undefined && !state.standalone ? state.codeContext?.formItemName : state.codeContext?.name}
	title={state.codeContext?.title}
	className={cssClasses}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</SelectableTile>;
};
