import React from 'react';
import { Tooltip } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface TooltipState {
	type: string;
	align: string;
	description: string | number;
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
	label={state.description}
	align={state.align}
	name={state.codeContext?.name}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{state.description}
	</Tooltip>;
};
