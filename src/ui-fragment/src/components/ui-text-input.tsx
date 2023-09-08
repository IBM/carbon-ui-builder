import React from 'react';
import { TextInput } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface TextInputState {
	type: string;
	id: string | number;
	label: string;
	placeholder?: string;
	value?: string;
	helperText?: string;
	defaultValue?: string;
	disabled?: boolean;
	light?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'text-input';

export const slots = {
	...commonSlots,
	...slotsDisabled,
	value: 'string',
	defaultValue: 'string',
	helperText: 'string',
	placeholder: 'string'
};

export const signals = ['change', 'click'];

export const UITextInput = ({ state, name, sendSignal }: {
	state: TextInputState;
	name?: string;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'text-input') {
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

	return <TextInput
		id={state.codeContext?.name}
		name={name}
		value={state.value || ''}
		placeholder={state.placeholder}
		labelText={state.label}
		helperText={state.helperText}
		defaultValue={state.defaultValue}
		disabled={state.disabled}
		light={state.light}
		onClick={() => {
			sendSignal(state.id, 'click');
		}}
		onChange={(event: any) => {
			sendSignal(state.id, 'change', [event.target.value], { ...state, value: event.target.value });
		}}
		className={cssClasses} />;
};
