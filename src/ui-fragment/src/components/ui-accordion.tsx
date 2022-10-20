import React from 'react';
import { Accordion } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';
import { AccordionItemState } from './ui-accordion-item';

export interface AccordionState {
	type: string;
	items: AccordionItemState[];
	id: string | number;
	align?: string;
	size?: string;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIAccordion = ({ state, setState, setGlobalState }: {
	state: AccordionState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'accordion') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Accordion
	align={state.align}
	size={state.size}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</Accordion>;
};
