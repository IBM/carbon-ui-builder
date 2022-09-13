import React from 'react';
import { Tooltip } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface TooltipState {
	type: string;
	direction: string;
	description: string | number;
	triggerText: string;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
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

	return <Tooltip
		description={state.description}
		direction={state.direction}
		name={state.codeContext?.name}
		triggerText={state.triggerText}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
			{state.description}
		</Tooltip>;
};
