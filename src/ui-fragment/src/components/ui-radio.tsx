import React from 'react';
import { RadioButton } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface RadioState {
	type: string;
	id: string | number;
	labelText: string;
	disabled?: boolean;
	checked?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIRadio = ({ state, setState, name }: {
	state: RadioState;
	name?: string;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'radio') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <RadioButton
		id={state.codeContext?.name}
		name={name}
		value={state.id}
		labelText={state.labelText}
		disabled={state.disabled}
		checked={!!state.checked}
		onChange={(id: string) => setState({ ...state, checked: id === state.id })}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
