import React from 'react';
import { Loading } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface LoadingState {
	type: string;
	id: string | number;
	size?: string;
	active?: boolean;
	overlay?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UILoading = ({ state }: {
	state: LoadingState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'loading') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Loading
		active={state.active}
		withOverlay={state.overlay}
		small={state.size === 'small'}
		name={state.codeContext?.name}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
