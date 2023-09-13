import React from 'react';
import { Slider } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface SliderState {
	type: string;
	id: string;
	cssClasses?: CssClasses[];
	labelText: string;
	min: number;
	max: number;
	disabled?: boolean;
	step?: number;
	textInputIsHidden?: boolean;
	light?: boolean;
	value: number;
	stepMultiplier?: number;
	minLabel?: string;
	maxLabel?: string;
	codeContext?: {
		name: string;
	};
}

export const UISlider = ({ state }: {
	state: SliderState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'slider') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Slider
		inert
		id={state.id}
		labelText={state.labelText}
		min={state.min}
		max={state.max}
		value={state.value}
		disabled={state.disabled}
		step={state.step}
		hideTextInput={state.textInputIsHidden}
		stepMultiplier={state.stepMultiplier}
		minLabel={state.minLabel}
		maxLabel={state.maxLabel}
		light={state.light}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
