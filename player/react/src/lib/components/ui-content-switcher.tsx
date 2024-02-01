import React from 'react';
import { ContentSwitcher, Switch } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots } from '../common-slots';

export interface ContentSwitcherState {
	type: string;
	items: [];
	size: [];
	selectedIndex: number;
	id: string | number;
	disabled?: boolean;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	style?: any;
	codeContext: {
		name: string;
	};
}

export const type = 'content-switcher';

export const slots = {
	...commonSlots,
	selectedIndex: 'number'
};

export const UIContentSwitcher = ({ state, sendSignal }: {
	state: ContentSwitcherState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'content-switcher') {
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

	return <ContentSwitcher
	size={state.size}
	selectedIndex={state.selectedIndex}
	className={cssClasses}
	onChange={({ index }: any) => {
		sendSignal(state.id, 'change', [index], { ...state, selectedIndex: index });
	}}>
		{
			state.items.map((step: any, index: number) => <Switch
				className={step.className}
				name={step.name}
				text={step.text}
				disabled={step.disabled}
				key={index}
			/>)
		}
	</ContentSwitcher>;
};
