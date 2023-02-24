import React from 'react';
import { CodeSnippet } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface CodeSnippetState {
	type: string;
	variant: string;
	code: string;
	id: string | number;
	cssClasses?: CssClasses[];
	light: boolean;
	codeContext?: {
		name: string;
	};
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

	return <CodeSnippet
	light={state.light}
	type={state.variant}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{state.code}
	</CodeSnippet>;
};
