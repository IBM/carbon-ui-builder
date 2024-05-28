import React from 'react';
import { CssClasses } from '../types';
import {
	OrderedList,
	UnorderedList,
	ListItem } from '@carbon/react';
import { commonSlots } from '../common-slots';

export interface ListState {
	type: string;
	items: [];
	id: string | number;
	isOrderedList: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const slots = {
	...commonSlots
};

export const UIList = ({ state }: {
	state: ListState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'list') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	const ListComponent = state.isOrderedList? OrderedList : UnorderedList;

	return <ListComponent>
		{
			state.items?.map((item: any, index: any) => <ListItem key={index}>{item.value}</ListItem>)
		}
	</ListComponent>;
};
