import React from 'react';
import { NumberInput } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface NumberInputState {
	type: string;
	id: string | number;
	value?: number;
	size?: string;
	helperText?: string;
	min?: number;
	max?: number;
	step?: number;
	label?: string;
	warnText?: string;
	warn?: boolean;
	hideLabel?: boolean;
	hideSteppers?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	invalidText?: string;
	light?: boolean;
	allowEmpty?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UINumberInput = ({ state, setState }: {
	state: NumberInputState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'number-input') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <NumberInput
		id={state.id}
		name={state.codeContext?.name}
		value={state.value}
		size={state.size}
		helperText={state.helperText}
		min={state.min}
		max={state.max}
		step={state.step}
		label={state.label}
		warnText={state.warnText}
		warn={state.warn}
		hideLabel={state.hideLabel}
		hideSteppers={state.hideSteppers}
		disabled={state.disabled}
		readOnly={state.readOnly}
		invalid={state.invalid}
		invalidText={state.invalidText}
		light={state.light}
		allowEmpty={state.allowEmpty}
		onChange={(event: any) => setState({ ...state, value: event.imaginaryTarget.value })}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
