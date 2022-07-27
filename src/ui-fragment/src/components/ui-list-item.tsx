import React from 'react';
import { ListItem, OrderedList } from 'carbon-components-react';
import { CssClasses } from '../types';
import { css } from 'emotion';

export interface ListItemState {
	type: string;
	value: string;
	items: any[];
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIListItem = ({ state }: {
	state: ListItemState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	const getChildren = (step: any, child = false) => {
		if (!step.items) {
			return;
		}
		return 	<ListItem className={css`cursor: pointer;`}>
				{step.value}
				{step.items.length > 0 ? <OrderedList nested={child}>
						{step.items.map((innerStep: any) => getChildren(innerStep, true))}
					</OrderedList>
				: [] }
			</ListItem>;
	};
	if (state.type !== 'list-item') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <ListItem className={css`cursor: pointer;`}>
		{state.value}
		{state.items.length > 0 ? <OrderedList nested={true}>
				{state.items.map((step: any) => getChildren(step, true))}
			</OrderedList>
		: [] }
	</ListItem>;
};
