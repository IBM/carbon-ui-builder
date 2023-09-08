import React from 'react';
import { Toggle } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface ToggleState {
	type: string;
	onText: string;
	offText: string;
	size: string;
	header?: string;
	checked?: boolean;
	disabled?: boolean;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'toggle';

export const slots = {
	...commonSlots,
	...slotsDisabled,
	select: (state: ToggleState) => ({
		...state,
		checked: true
	}),
	deselect: (state: ToggleState) => ({
		...state,
		checked: false
	}),
	toggleSelected: (state: ToggleState) => ({
		...state,
		checked: !state.checked
	}),
	onText: 'string',
	offText: 'string',
	size: 'string',
	header: 'string',
	checked: 'boolean'
};

export const signals = ['toggle', 'click'];

export const UIToggle = ({ state, sendSignal }: {
	state: ToggleState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'toggle') {
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

	return <Toggle
		labelA={state.offText}
		labelB={state.onText}
		name={state.codeContext?.name}
		id={state.codeContext?.name}
		disabled={state.disabled}
		size={state.size}
		checked={!!state.checked}
		labelText={state.header}
		onClick={() => {
			sendSignal(state.id, 'click');
		}}
		onChange={(event: any) => {
			sendSignal(state.id, 'toggle', [event.target.checked], { ...state, checked: event.target.checked });
		}}
		className={cssClasses} />;
};
