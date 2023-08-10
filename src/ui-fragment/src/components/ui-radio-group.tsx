import React from 'react';
import { RadioButtonGroup } from 'carbon-components-react';
import { CssClasses } from '../types';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';
import { RadioState } from './ui-radio';

export interface RadioGroupState {
	type: string;
	items: RadioState[];
	id: string | number;
	legend: string;
	orientation: string;
	labelPosition: string;
	defaultSelected: string;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UIRadioGroup = ({ state, setState, setGlobalState, sendSignal }: {
	state: RadioGroupState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'radio-group') {
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

	return <RadioButtonGroup
	name={state.codeContext?.name}
	legendText={state.legend}
	orientation={state.orientation}
	labelPosition={state.labelPosition}
	defaultSelected={state.defaultSelected}
	valueChecked={state.defaultSelected}
	className={cssClasses}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</RadioButtonGroup>;
};
