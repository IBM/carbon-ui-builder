import React from 'react';
import { CodeSnippet } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface CodeSnippetState {
	type: string;
	variant: string;
	code: string;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UICodeSnippet = ({ state }: {
	state: CodeSnippetState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'code-snippet') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <CodeSnippet
	type={state.variant}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{state.code}
	</CodeSnippet>;
};
