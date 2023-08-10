import React from 'react';
import { Accordion } from 'carbon-components-react';
import { CssClasses } from '../types';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';
import { AccordionItemState } from './ui-accordion-item';

export interface AccordionState {
	type: string;
	items: AccordionItemState[];
	id: string | number;
	align?: string;
	size?: string;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UIAccordion = ({ state, sendSignal, setState, setGlobalState }: {
	state: AccordionState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'accordion') {
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

	return <Accordion
	align={state.align}
	size={state.size}
	className={cssClasses}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</Accordion>;
};
