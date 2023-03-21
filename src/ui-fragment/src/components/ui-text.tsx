import React from 'react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface TextState {
	type: string;
	text?: string;
	richText?: string;
	isSection?: boolean;
	hidden?: boolean | string;
	style?: any;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
}

export const UIText = ({ state, sendSignal }: {
	state: TextState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'text') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	if (state.hidden == 'true' || state.hidden == true) {
		return <></>;
	}

	let cssClasses = state.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (state.style) {
		if (cssClasses.length > 0) {
			cssClasses += ' ';
		}
		cssClasses += stringToCssClassName(state.codeContext.name);
	}

	if (state.richText) {
		if (state.isSection) {
			return <section className={cssClasses} dangerouslySetInnerHTML={{ __html: state.richText }} />;
		}
		return <div className={cssClasses} dangerouslySetInnerHTML={{ __html: state.richText }} />;
	}

	if (state.cssClasses) {
		return <span className={cssClasses}>
			{state.text}
		</span>;
	}

	return <>{state.text}</>;
};
