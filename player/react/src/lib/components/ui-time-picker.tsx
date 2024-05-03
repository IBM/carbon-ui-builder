import { TimePickerSelect, TimePicker, SelectItem } from '@carbon/react';
import React from 'react';
import { commonSlots, slotsDisabled } from '../common-slots';
import { SendSignal } from '../types';

export interface TimePickerState {
	id: string | number;
	codeContext?: {
		name: string;
	};
	type: string;
	placeholder: string;
	disabled?: boolean;
	invalid?: boolean;
	invalidText?: string;
	light?: boolean;
	size?: string;
	value?: string;
	label?: string;
	items: [];
}

export const type = 'time-picker';

export const signals = ['valueChange', 'click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	invalid: 'boolean',
	isInvalid: (state: TimePickerState) => ({
		...state,
		invalid: true
	}),
	isValid: (state: TimePickerState) => ({
		...state,
		invalid: false
	}),
	toggleIsInvalid: (state: TimePickerState) => ({
		...state,
		invalid: !state.invalid
	}),
	light: 'boolean',
	isLight: (state: TimePickerState) => ({
		...state,
		light: true
	}),
	isDark: (state: TimePickerState) => ({
		...state,
		light: false
	}),
	toggleIsLight: (state: TimePickerState) => ({
		...state,
		light: !state.light
	}),
	placeholder: 'string',
	type: 'string',
	invalidText: 'string',
	label: 'string',
	size: 'string',
	value: 'string'
};

export const UITimePicker = ({ state, sendSignal }: {
	state: TimePickerState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'time-picker') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <TimePicker
		id={state.codeContext?.name}
		light={state.light}
		disabled={state.disabled}
		invalid={state.invalid}
		invalidText={state.invalidText}
		placeholder={state.placeholder}
		size={state.size}
		labelText={state.label}
		onClick={() => {
			sendSignal(state.id, 'click');
		}}
		onChange={(event: any) => {
			sendSignal(state.id, 'valueChange', [event.value], { ...state, value: event.value });
		}}>
		<TimePickerSelect id={state.codeContext?.name + '-select-1'}>
			<SelectItem value='AM' text='AM' />
			<SelectItem value='PM' text='PM' />
		</TimePickerSelect>
		<TimePickerSelect id={state.codeContext?.name + '-select-2'}>
			{
				state.items.map((step: any, index: number) => <SelectItem
					value={step.value}
					text={step.text}
					key={index}
				/>)
			}
		</TimePickerSelect>
	</TimePicker>;
};
