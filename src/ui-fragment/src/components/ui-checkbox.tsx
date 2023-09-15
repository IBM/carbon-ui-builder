import React from 'react';
import { Checkbox } from 'carbon-components-react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface CheckboxState {
	type: string;
	label: string;
	checked: boolean;
	id: string | number;
	disabled?: boolean;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'checkbox';

export const signals = ['toggle', 'click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	select: (state: CheckboxState) => ({
		...state,
		checked: true
	}),
	deselect: (state: CheckboxState) => ({
		...state,
		checked: false
	}),
	toggleSelected: (state: CheckboxState) => ({
		...state,
		checked: !state.checked
	}),
	checked: 'boolean',
	label: 'string'
};

export const UICheckbox = ({ state, sendSignal }: {
	state: CheckboxState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'checkbox') {
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

	return <Checkbox
		disabled={state.disabled}
		labelText={state.label}
		name={state.codeContext?.name}
		id={state.codeContext?.name}
		checked={!!state.checked}
		onClick={() => {
			sendSignal(state.id, 'click');
		}}
		onChange={(checked: boolean) => {
			sendSignal(state.id, 'toggle', [checked], { ...state, checked });
		}}
		className={cssClasses} />;
};
