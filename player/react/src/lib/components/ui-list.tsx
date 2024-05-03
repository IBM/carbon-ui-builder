import React from 'react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';
import { css, cx } from 'emotion';
import { OrderedList } from '@carbon/react';

export interface ListState {
	type: string;
	items: [];
	legendName: string;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIList = ({ state, setState, setGlobalState, sendSignal }: {
	state: ListState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
    sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'list') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	return <>
			<legend className={cx(css`margin-left: 3px;`, 'bx--label')}>
				{state.legendName}
			</legend>
			<OrderedList className={cx(css`margin-left: 30px;`)}>
				{	state.items?.map((item: any) => {
						const setItem = (i: any) => setItemInState(i, state, setState);
						return renderComponents(item, setItem, setGlobalState, sendSignal);
					})
				}
			</OrderedList>
	</>;
};
