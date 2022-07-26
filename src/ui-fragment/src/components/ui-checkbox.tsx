import React from 'react';
import { Checkbox } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface CheckboxState {
	type: string;
	label: string;
	checked: boolean;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UICheckbox = ({ state, setState }: {
	state: CheckboxState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'checkbox') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Checkbox
		labelText={state.label}
		name={state.codeContext?.name}
		id={state.codeContext?.name}
		checked={state.checked}
		onChange={(checked: boolean) => setState({ ...state, checked })}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
