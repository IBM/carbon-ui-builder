import React from 'react';
import { CssClasses } from '../types';

export interface TextState {
	type: string;
	text: string;
	cssClasses?: CssClasses[];
}

export const UIText = ({ state }: {
	state: TextState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'text') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return state.cssClasses
		? <span className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
			{state.text}
		</span>
		: <>{state.text}</>;
};
