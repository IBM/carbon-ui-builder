import React from 'react';
import { Toggle } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface ToggleState {
	type: string;
	onText: string;
	offText: string;
	size: string;
	checked?: boolean;
	disabled?: string | boolean;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UIToggle = ({ state, setState, sendSignal }: {
	state: ToggleState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'toggle') {
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

	return <Toggle
		labelA={state.offText}
		labelB={state.onText}
		name={state.codeContext?.name}
		id={state.codeContext?.name}
		disabled={state.disabled}
		size={state.size}
		checked={!!state.checked}
		onChange={(event: any) => setState({ ...state, checked: event.target.checked })}
		className={cssClasses} />;
};
