import React from 'react';
import { Checkbox } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface CheckboxState {
	type: string;
	label: string;
	checked: boolean;
	id: string | number;
	disabled?: string | boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UICheckbox = ({ state, setState, sendSignal }: {
	state: CheckboxState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'checkbox') {
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

	return <Checkbox
		disabled={state.disabled}
		labelText={state.label}
		name={state.codeContext?.name}
		id={state.codeContext?.name}
		checked={!!state.checked}
		onChange={(checked: boolean) => setState({ ...state, checked })}
		className={cssClasses} />;
};
