import React from 'react';
import { RadioButton } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface RadioState {
	type: string;
	id: string | number;
	labelText: string;
	disabled?: string | boolean;
	checked?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UIRadio = ({ state, setState, name }: {
	state: RadioState;
	name?: string;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'radio') {
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

	return <RadioButton
		id={state.codeContext?.name}
		name={name}
		value={state.id}
		labelText={state.labelText}
		disabled={state.disabled}
		checked={!!state.checked}
		onChange={(id: string) => setState({ ...state, checked: id === state.id })}
		className={cssClasses} />;
};
