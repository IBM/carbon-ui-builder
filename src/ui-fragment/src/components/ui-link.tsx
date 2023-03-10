import React from 'react';
import { Link } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface LinkState {
	type: string;
	text: string;
	id: string | number;
	disabled?: string | boolean;
	inline?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
		href?: string;
	};
	style?: any;
}

export const UILink = ({ state, sendSignal }: {
	state: LinkState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'link') {
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

	return <Link
	disabled={state.disabled}
	inline={state.inline}
	name={state.codeContext?.name}
	href={state.codeContext?.href}
	className={cssClasses}>
		{state.text}
	</Link>;
};
