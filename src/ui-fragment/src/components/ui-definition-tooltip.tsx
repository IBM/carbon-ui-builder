import React from 'react';
import { DefinitionTooltip } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface DefinitionTooltipState {
	id: string;
	type: string;
	alignment: string;
	codeContext: {
		name: string;
	};
	description: string;
	isDefaultOpened?: boolean;
	definition?: string;
	isOpenOnHover?: boolean;
	cssClasses?: CssClasses[];
	style?: any;
}

export const type = 'definition-tooltip';
export const slots = {
	...commonSlots,
	...slotsDisabled,
	enableOpenOnHover: (state: any) => ({
		...state,
		isOpenOnHover: true
	}),
	disableOpenOnHover: (state: any) => ({
		...state,
		isOpenOnHover: false
	}),
	toggleOpenOnHover: (state: any) => ({
		...state,
		isOpenOnHover: !state.isOpenOnHover
	}),
	enableOpenOnDefault: (state: any) => ({
		...state,
		isDefaultOpened: true
	}),
	disableOpenOnDefault: (state: any) => ({
		...state,
		isDefaultOpened: false
	}),
	toggleOpenOnDefault: (state: any) => ({
		...state,
		isDefaultOpened: !state.isDefaultOpened
	}),
	isOpenOnHover: 'boolean',
	isDefaultOpened: 'boolean',
	alignment: 'string',
	definition: 'string',
	description: 'string'
};

export const signals = ['click'];

export const UIDefinitionTooltip = ({ state, sendSignal }: {
	state: DefinitionTooltipState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'definition-tooltip') {
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

	return <DefinitionTooltip
		id={state.id}
		onClick={() => sendSignal(state.id, 'click')}
		align={state.alignment ? state.alignment : 'bottom-left'}
		definition={state.definition}
		name={state.codeContext?.name}
		openOnHover={state.isOpenOnHover ? state.isOpenOnHover : false}
		defaultOpen={state.isDefaultOpened ? state.isDefaultOpened : false}
		className={cssClasses}>
			{state.description}
		</DefinitionTooltip>;
};
