import React from 'react';
import {
	DatePicker,
	DatePickerInput
} from '@carbon/react';
import { commonSlots, slotsDisabled } from '../common-slots';
import { SendSignal, CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface DatePickerState {
	type: string;
	placeholder: string;
	disabled?: boolean;
	id: string;
	invalid?: boolean;
	invalidText?: string;
	rangeInvalidText?: string;
	light?: boolean;
	size?: string;
	kind?: string;
	dateFormat?: string;
	value?: string;
	rangeStartLabel?: string;
	rangeEndLabel?: string;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'date-picker';

export const slots = {
	...commonSlots,
	...slotsDisabled,
	dateFormat: 'string',
	kind: 'string',
	placeholder: 'string',
	size: 'string',
	invalidText: 'string',
	rangeStartLabel: 'string',
	rangeEndLabel: 'string',
	rangeInvalidText: 'string',
	value: 'string',
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
	}),
	light: 'boolean',
	setLight: (state: DatePickerState) => ({
		...state,
		light: true
	}),
	setDark: (state: DatePickerState) => ({
		...state,
		light: false
	}),
	toggleLight: (state: DatePickerState) => ({
		...state,
		light: !state.light
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

	let cssClasses = state.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (state.style) {
		if (cssClasses.length > 0) {
			cssClasses += ' ';
		}
		cssClasses += stringToCssClassName(state.codeContext.name);
	}

	return <DatePicker
		className={cssClasses}
		dateFormat={state.dateFormat}
		datePickerType={state.kind}
		value={state.value}
		light={state.light}
		onClick={() => sendSignal(state.id, 'click')}
		onChange={(event: any) => {
			sendSignal(state.id, 'valueChange', [event[0].toISOString()], { ...state, value: event[0].toISOString() });
		}}>
			<DatePickerInput
				id={state.id}
				placeholder={state.placeholder}
				labelText={state.rangeStartLabel}
				size={state.size}
				disabled={state.disabled}
				invalid={state.invalid}
				invalidText={state.invalidText}/>
			{
				state.kind === 'range' &&
					<DatePickerInput
						id={`${state.id}-end`}
						placeholder={state.placeholder}
						labelText={state.rangeEndLabel}
						size={state.size}
						disabled={state.disabled}
						invalid={state.invalid}
						invalidText={state.rangeInvalidText} />
			}
		</DatePicker>;
};
