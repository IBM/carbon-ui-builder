import React from 'react';
import { Row } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface RowState {
	type: string;
	items: any[]; // TODO row type
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIRow = ({ state, setState, setGlobalState }: {
	state: RowState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'row') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Row className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</Row>;
};
