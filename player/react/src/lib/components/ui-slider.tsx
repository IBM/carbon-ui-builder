import React from 'react';
import { Slider } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface SliderState {
	type: string;
	id: string;
	labelText: string;
	min: number;
	max: number;
	value: number;
	cssClasses?: CssClasses[];
	disabled?: boolean;
	step?: number;
	textInputHidden?: boolean;
	light?: boolean;
	stepMultiplier?: number;
	minLabel?: string;
	maxLabel?: string;
	codeContext?: {
		name: string;
	};
}

export const type = 'slider';

export const slots = {
	...slotsDisabled,
	...commonSlots,
	textInputHidden: 'boolean',
	hideTextInput: (state: SliderState) => ({
		...state,
		textInputHidden: true
	}),
	showTextInput: (state: SliderState) => ({
		...state,
		textInputHidden: false
	}),
	toggleTextInputVisibility: (state: SliderState) => ({
		...state,
		textInputHidden: !state.textInputHidden
	}),
	labelText: 'string',
	min: 'number',
	max: 'number',
	value: 'number',
	step: 'number',
	stepMultiplier: 'number',
	minLabel: 'string',
	maxLabel: 'string'
};

export const signals = ['valueChange', 'click'];

export const UISlider = ({ state, sendSignal }: {
	state: SliderState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'slider') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Slider
	id={state.id}
	labelText={state.labelText}
	min={state.min}
	max={state.max}
	value={state.value}
	disabled={state.disabled}
	step={state.step}
	hideTextInput={state.textInputHidden}
	stepMultiplier={state.stepMultiplier}
	minLabel={state.minLabel}
	maxLabel={state.maxLabel}
	light={state.light}
	onClick={() => sendSignal(state.id, 'click')}
	onChange={(event: any) => {
		sendSignal(state.id, 'valueChange', [event.value], { ...state, value: event.value });
	}}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
