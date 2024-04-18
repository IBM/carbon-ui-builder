import React from 'react';
import { AccordionItem } from '@carbon/react';
import { CssClasses } from '../types';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface AccordionItemState {
	type: string;
	items?: any[]; // TODO type
	title: string;
	id: string | number;
	isOpen?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'accordion-item';

export const signals = ['click', 'headingClick'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	open: (state: any) => ({
		...state,
		open: true
	}),
	close: (state: any) => ({
		...state,
		open: false
	}),
	toggleOpen: (state: any) => ({
		...state,
		open: !state.open
	}),
	isOpen: 'boolean',
	title: 'string'
};

export const UIAccordionItem = ({ state, setState, setGlobalState, sendSignal }: {
	state: AccordionItemState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'accordion-item') {
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

	return <AccordionItem
	title={state.title}
	disabled={state.disabled}
	open={state.isOpen}
	onClick={() => sendSignal(state.id, 'click')}
	onHeadingClick={() => sendSignal(state.id, 'headingClick')}
	className={cssClasses}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</AccordionItem>;
};
