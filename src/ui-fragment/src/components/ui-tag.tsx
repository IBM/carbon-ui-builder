import React from 'react';
import { Tag } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface TagState {
	type: string;
	kind: string;
	title: string;
	id: string | number;
	size?: string;
	closeLabel?: string;
	filter?: boolean;
	disabled?: string | boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UITag = ({ state, sendSignal }: {
	state: TagState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'tag') {
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

	return <Tag
	type={state.kind}
	size={state.size}
	disabled={state.disabled}
	filter={state.filter}
	title={state.closeLabel}
	className={cssClasses}>
		{state.title}
	</Tag>;
};
