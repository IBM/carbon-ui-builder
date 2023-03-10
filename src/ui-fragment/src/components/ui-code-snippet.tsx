import React from 'react';
import { CodeSnippet } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface CodeSnippetState {
	type: string;
	variant: string;
	code: string;
	id: string | number;
	cssClasses?: CssClasses[];
	light: boolean;
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UICodeSnippet = ({ state, sendSignal }: {
	state: CodeSnippetState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'code-snippet') {
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

	return <CodeSnippet
	light={state.light}
	type={state.variant}
	className={cssClasses}>
		{state.code}
	</CodeSnippet>;
};
