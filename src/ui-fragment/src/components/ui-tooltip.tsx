import React from 'react';
import { Tooltip } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface TooltipState {
	type: string;
	placement?: string;
	alignment?: string;
	description: string | number;
	triggerText: string;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UITooltip = ({ state }: {
	state: TooltipState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
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
		description={state.description}
		direction={state.placement ? state.placement : 'top'}
align={state.alignment ? state.alignment : 'center'}
		name={state.codeContext?.name}
		triggerText={state.triggerText}
		className={cssClasses}>
			{state.description}
		</Tooltip>;
};
