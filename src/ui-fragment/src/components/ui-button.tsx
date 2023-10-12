import React from 'react';
import { Button } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { slotsDisabled, commonSlots } from '../common-slots';

export interface ButtonState {
	type: string;
	kind: string;
	size: string;
	text: string;
	id: string | number;
	disabled?: boolean;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'button';

export const slots = {
	...slotsDisabled,
	...commonSlots,
	text: 'string',
	size: 'string'
};

export const signals = ['click'];

export const UIButton = ({ state, sendSignal }: {
	state: ButtonState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
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
