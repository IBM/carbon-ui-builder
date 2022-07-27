import React from 'react';
import { OrderedList } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';
import { ListItemState } from './ui-list-item';
import { css, cx } from 'emotion';

export interface ListState {
	type: string;
	items: ListItemState[];
	legendName: string;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIList = ({ state, setState, setGlobalState }: {
	state: ListState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'list') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <>
			<legend className={cx(css`margin-left: 3px;`, 'bx--label')}>
				{state.legendName}
			</legend>
			<OrderedList className={cx(css`margin-left: 25px;`)}>
				{	state.items?.map((item: any) => {
						const setItem = (i: any) => setItemInState(i, state, setState);
						return renderComponents(item, setItem, setGlobalState);
					})
				}
			</OrderedList>
	</>;
};
