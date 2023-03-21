import React from 'react';
import { TextInput } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface TextInputState {
	type: string;
	id: string | number;
	label: string;
	placeholder?: string;
	value?: string;
	helperText?: string;
	defaultValue?: string;
	disabled?: string | boolean;
	light?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UITextInput = ({ state, setState, name }: {
	state: TextInputState;
	name?: string;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'text-input') {
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

	return <TextInput
		id={state.codeContext?.name}
		name={name}
		value={state.value || ''}
		placeholder={state.placeholder}
		labelText={state.label}
		helperText={state.helperText}
		defaultValue={state.defaultValue}
		disabled={state.disabled}
		light={state.light}
		onChange={(event: any) => setState({ ...state, value: event.target.value })}
		className={cssClasses} />;
};
