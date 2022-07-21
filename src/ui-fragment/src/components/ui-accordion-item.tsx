import React from 'react';
import { AccordionItem } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface AccordionItemState {
	type: string;
	items?: any[]; // TODO type
	title: string;
	id: string | number;
	disabled?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIAccordionItem = ({ state, setState, setGlobalState }: {
	state: AccordionItemState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'accordion-item') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <AccordionItem
	title={state.title}
	disabled={state.disabled}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</AccordionItem>;
};
