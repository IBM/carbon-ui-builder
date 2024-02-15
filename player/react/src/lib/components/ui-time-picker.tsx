import { TimePickerSelect } from '@carbon/react';
import { SelectItem } from '@carbon/react';
import { TimePicker } from '@carbon/react';
import React from 'react';

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

export const UITimePicker = ({ state }: {
	state: TimePickerState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'time-picker') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	return <TimePicker
		id='time-picker'
		light={state.light}
		disabled={state.disabled}
		invalid={state.invalid}
		invalidText={state.invalidText}
		placeholder={state.placeholder}
		size={state.size}
		labelText={state.label}>
		<TimePickerSelect labelText='time-picker-1' id='time-picker-select-1'>
			<SelectItem value='AM' text='AM' />
			<SelectItem value='PM' text='PM' />
		</TimePickerSelect>
		<TimePickerSelect labelText='time-picker-2' id='time-picker-select-2' >
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
