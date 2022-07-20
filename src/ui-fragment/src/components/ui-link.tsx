import React from 'react';
import { Link } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface LinkState {
	type: string;
	text: string;
	id: string | number;
	disabled?: boolean;
	inline?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
		href?: string;
	};
}

export const UILink = ({ state }: {
	state: LinkState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'link') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Link
	disabled={state.disabled}
	inline={state.inline}
	name={state.codeContext?.name}
	href={state.codeContext?.href}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{state.text}
	</Link>;
};
