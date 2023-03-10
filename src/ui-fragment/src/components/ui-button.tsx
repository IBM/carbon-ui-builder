import React from 'react';
import { Button } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface ButtonState {
	type: string;
	kind: string;
	size: string;
	text: string;
	id: string | number;
	disabled?: string | boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
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

	let cssClasses = state.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (state.style) {
		if (cssClasses.length > 0) {
			cssClasses += ' ';
		}
		cssClasses += stringToCssClassName(state.codeContext.name);
	}

	return <Button
	disabled={state.disabled}
	kind={state.kind}
	size={state.size}
	name={state.codeContext?.name}
	onClick={() => sendSignal(state.id, 'click')}
	className={cssClasses}>
		{state.text}
	</Button>;
};
