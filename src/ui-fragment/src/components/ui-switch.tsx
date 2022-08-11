import React from 'react';
import { Switch } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface SwitchState {
	type: string;
	text: string;
	name: string;
	disabled?: boolean;
	cssClasses?: CssClasses[];
}

export const UISwitch = ({ state }: {
	state: SwitchState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'switch-item') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Switch
		name={state.name}
		key={state.text}
		text={state.text}
		disabled={state.disabled}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
