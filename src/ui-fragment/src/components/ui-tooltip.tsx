import React from 'react';
import { Tooltip } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface TooltipState {
	type: string;
	align: string;
	label: string | number;
	triggerText: string;
	isOpen: boolean;
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
		label={state.label}
		align={state.align}
		name={state.codeContext?.name}
		triggerText={state.triggerText}
		open={state.isOpen}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
			{state.label}
		</Tooltip>;
};
