import React from 'react';
import { Slider } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface SliderState {
	type: string;
	cssClasses?: CssClasses[];
	labelText: string,
	min: number,
	max: number,
	disabled: boolean,
	step: number,
	hideTextInput: boolean,
	light: boolean,
	value: number,
	stepMultiplier: number,
	minLabel: string,
	maxLabel: string,
	codeContext?: {
		name: string;
	};
}

export const UISlider = ({ state, setState, setGlobalState }: {
	state: SliderState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'slider') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Slider
	id="slider"
	labelText={state.labelText}
	min={state.min}
	max={state.max}
	value={state.value}
	disabled={state.disabled}
	step={state.step}
	hideTextInput={state.hideTextInput}
	stepMultiplier={state.stepMultiplier}
	minLabel={state.minLabel}
	maxLabel={state.maxLabel}
	light={state.light}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
	</Slider>;
};
