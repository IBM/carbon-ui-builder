import React from 'react';
import { Link } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface LinkState {
	type: string;
	text: string;
	id: string | number;
	disabled?: boolean;
	inline?: boolean;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
		href?: string;
	};
	style?: any;
}

export const type = 'link';

export const slots = {
	...commonSlots,
	...slotsDisabled
};

export const UILink = ({ state }: {
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
