import React from 'react';
import { Tooltip } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface TooltipState {
	id: string;
	type: string;
	direction?: string;
	alignment?: string;
	description: string | number;
	triggerText: string;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'tooltip';
export const slots = {
	...commonSlots,
	...slotsDisabled,
	alignment: 'string',
	description: 'string',
	direction: 'string',
	triggerText: 'string'
};

export const signals = ['click'];

export const UITooltip = ({ state, sendSignal }: {
	state: TooltipState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'tooltip') {
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

	return <Tooltip
		id={state.id}
		onClick={() => sendSignal(state.id, 'click')}
		description={state.description}
		direction={state.direction ? state.direction : 'top'}
		align={state.alignment ? state.alignment : 'center'}
		name={state.codeContext?.name}
		triggerText={state.triggerText}
		className={cssClasses}>
			{state.description}
		</Tooltip>;
};
