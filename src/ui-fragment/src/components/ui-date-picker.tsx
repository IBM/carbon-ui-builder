import React from 'react';
import {
	DatePicker,
	DatePickerInput
} from 'carbon-components-react';

export interface DatePickerState {
	text: string;
	id: string | number;
	inline?: boolean;
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
	datePickerType?: string;
	dateFormat?: string;
	value?: string;
	rangeStartLabel?: string;
	rangeEndLabel?: string;
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
	return <DatePicker dateFormat={state.dateFormat} datePickerType={state.datePickerType} light={state.light}>
			<DatePickerInput
				id="date-picker-default-id"
				placeholder={state.placeholder}
				labelText={state.rangeStartLabel}
				type="text"
				size={state.size}
				disabled={state.disabled}
				invalid={state.invalid}
				invalidText={state.invalidText}
			/>
			{
				state.datePickerType === 'range'
				&& <DatePickerInput
						id="date-picker-range-end"
						placeholder={state.placeholder}
						labelText={state.rangeEndLabel}
						type="text"
						size={state.size}
						disabled={state.disabled}
						invalid={state.invalid}
						invalidText={state.invalidText}
					/>
			}
		</DatePicker>;
};
