import React from 'react';
import { Loading } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface LoadingState {
	type: string;
	id: string | number;
	size?: string;
	active?: boolean;
	overlay?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UILoading = ({ state, sendSignal }: {
	state: LoadingState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'loading') {
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

	return <Loading
		active={state.active}
		withOverlay={state.overlay}
		small={state.size === 'small'}
		name={state.codeContext?.name}
		className={cssClasses} />;
};
