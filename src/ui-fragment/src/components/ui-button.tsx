import React from 'react';
import { Button } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface ButtonState {
	type: string;
	kind: string;
	size: string;
	text: string;
	id: string | number;
	disabled?: string | boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIButton = ({ state, setGlobalState, sendSignal }: {
	state: ButtonState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {

	if (state.type !== 'button') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Button
	disabled={state.disabled}
	kind={state.kind}
	size={state.size}
	name={state.codeContext?.name}
	onClick={() => sendSignal(state.id, 'click')}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{state.text}
	</Button>;
};
