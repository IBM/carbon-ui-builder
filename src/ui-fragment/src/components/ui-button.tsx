import React from 'react';
import { Button } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface ButtonState {
	type: string;
	kind: string;
	size: string;
	style?: any;
	text: string;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
}

export const UIButton = ({ state }: {
	state: ButtonState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
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
	kind={state.kind}
	size={state.size}
	name={state.codeContext?.name}
	className={cssClasses}>
		{state.text}
	</Button>;
};
