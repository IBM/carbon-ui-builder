import React from 'react';
import { ContentSwitcher } from 'carbon-components-react';
import { renderComponents, setItemInState } from '../utils';
import { CssClasses } from '../types';
import { SwitchState } from './ui-switch';

export interface ContentSwitcherState {
	type: string;
	items: SwitchState[];
	size: [],
	cssClasses?: CssClasses[];
}

export const UIContentSwitcher = ({ state, setState, setGlobalState }: {
	state: ContentSwitcherState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'content-switcher') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <ContentSwitcher
	size={state.size}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</ContentSwitcher>;
};
