import React from 'react';
import { InlineLoading } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface InlineLoadingState {
	type: string;
	status: string;
	activeIconDescription: string;
	activeText: string;
	errorIconDescription: string;
	errorText: string;
	inactiveIconDescription: string;
	inactiveText: string;
	finishedIconDescription: string;
	successText: string;
	successDelay: number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIInlineLoading = ({ state, sendSignal }: {
	state: InlineLoadingState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'inline-loading') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	const status: any = {
		active: {
			iconDescription: state.activeIconDescription,
			description: state.activeText
		},
		error: {
			iconDescription: state.errorIconDescription,
			description: state.errorText
		},
		inactive: {
			iconDescription: state.inactiveIconDescription,
			description: state.inactiveText
		},
		finished: {
			iconDescription: state.finishedIconDescription,
			description: state.successText
		}
	};
	return <InlineLoading
		successDelay={state.successDelay}
		description={status[state.status].description}
		iconDescription={status[state.status].iconDescription}
		status={state.status}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
