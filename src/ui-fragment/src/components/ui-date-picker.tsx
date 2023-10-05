import React from 'react';
import {
	DatePicker,
	DatePickerInput
} from '@carbon/react';
import { commonSlots, slotsDisabled } from '../common-slots';
import { SendSignal } from '../types';

export interface DatePickerState {
	type: string;
	placeholder: string;
	disabled?: boolean;
	id: string;
	invalid?: boolean;
	invalidText?: string;
	light?: boolean;
	size?: string;
	datePickerType?: string;
	dateFormat?: string;
	value?: string;
	rangeStartLabel?: string;
	rangeEndLabel?: string;
}

export const type = 'datepicker';

export const slots = {
	...commonSlots,
	...slotsDisabled,
	dateFormat: 'string',
	datePickerType: 'string',
	placeholder: 'string',
	labelText: 'string',
	size: 'string',
	invalidText: 'string',
	invalid: 'boolean',
	setInvalid: (state: DatePickerState) => ({
		...state,
		invalid: true
	}),
	setValid: (state: DatePickerState) => ({
		...state,
		invalid: false
	}),
	toggleValid: (state: DatePickerState) => ({
		...state,
		invalid: !state.invalid
	})
};

export const signals = ['valueChange', 'click'];

export const UIDatePicker = ({ state, sendSignal }: {
	state: DatePickerState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'date-picker') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	return <DatePicker
		id={state.id}
		dateFormat={state.dateFormat}
		datePickerType={state.datePickerType}
		light={state.light}
		onClick={() => sendSignal(state.id, 'click')}
		onChange={(event: any) => {
			debugger
			sendSignal(state.id, 'valueChange', [event.value], { ...state, value: event.value });
		}}>
			<DatePickerInput
				placeholder={state.placeholder}
				labelText={state.rangeStartLabel}
				size={state.size}
				disabled={state.disabled}
				invalid={state.invalid}
				invalidText={state.invalidText}/>
			{
				state.datePickerType === 'range' &&
					<DatePickerInput
						placeholder={state.placeholder}
						labelText={state.rangeEndLabel}
						size={state.size}
						disabled={state.disabled}
						invalid={state.invalid}
						invalidText={state.invalidText} />
			}
		</DatePicker>;
};
