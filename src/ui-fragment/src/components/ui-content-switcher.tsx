import React from 'react';
import { ContentSwitcher, Switch } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface ContentSwitcherState {
	type: string;
	items: [];
	size: [];
	selectedIndex: number;
	cssClasses?: CssClasses[];
}

export const UIContentSwitcher = ({ state, sendSignal }: {
	state: ContentSwitcherState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'content-switcher') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <ContentSwitcher
	size={state.size}
	selectedIndex={state.selectedIndex}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
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
