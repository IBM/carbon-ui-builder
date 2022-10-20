import React from 'react';
import { Toggle } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface ToggleState {
	type: string;
	onText: string;
	offText: string;
	size: string;
	checked?: boolean;
	disabled?: boolean;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIToggle = ({ state, setState }: {
	state: ToggleState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'toggle') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
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
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
