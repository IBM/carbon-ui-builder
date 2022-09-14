import React from 'react';
import {
	DatePicker,
	TimePicker,
	TimePickerSelect,
	SelectItem,
	DatePickerInput
} from 'carbon-components-react';
import { CssClasses } from '../types';

export interface DatePickerState {
	text: string;
	id: string | number;
	inline?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
	type: string;
	placeHolder: string;
	disabled?: boolean;
	invalid?: boolean;
	light?: boolean;
	size?: string;
	datePickerType?: string;
	dateFormat?: string;
	value?: string;
	rangeStartLabel?: string;
	rangeEndLabel?: string;
	items: [];
}

export const UIDatePicker = ({ state }: {
	state: DatePickerState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'date-picker') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return (state.datePickerType === 'timePicker'
	? <TimePicker id="time-picker" light={state.light}>
		<TimePickerSelect labelText="time-picker-1" id="time-picker-select-1">
			<SelectItem value="AM" text="AM" />
			<SelectItem value="PM" text="PM" />
		</TimePickerSelect>
		<TimePickerSelect labelText="time-picker-2" id="time-picker-select-2" >
			{
				state.items.map((step: any, index: number) => <SelectItem
					value={step.value}
					text={step.text}
					key={index}
				/>)
			}
		</TimePickerSelect>
		</TimePicker>
		: <DatePicker dateFormat={state.dateFormat} datePickerType={state.datePickerType} light={state.light}>
			<DatePickerInput
				id="date-picker-default-id"
				placeholder={state.placeHolder}
				labelText={state.rangeStartLabel}
				type="text"
				size={state.size}
				disabled={state.disabled}
				invalid={state.invalid}
			/>
			{
				state.datePickerType === 'range'
				&& <DatePickerInput
						id="date-picker-range-end"
						placeholder={state.placeHolder}
						labelText={state.rangeEndLabel}
						type="text"
						size={state.size}
						disabled={state.disabled}
						invalid={state.invalid}
					/>
			}
		</DatePicker>
	);
};
