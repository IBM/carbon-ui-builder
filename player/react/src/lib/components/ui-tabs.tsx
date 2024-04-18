import React from 'react';
import { Tabs, Tab } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { renderComponents, setItemInState } from '../utils';
import { cx } from 'emotion';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface TabsState {
	type: string;
	id: string | number;
	items?: [];
	selectedTab: number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export interface TabState {
	type: string;
	id?: string | number;
	disabled?: boolean;
	label: string;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext: {
		name?: string;
	};
}

export const type = 'tab';

export const signals = ['click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	open: (state: any) => ({
		...state,
		open: true
	}),
	close: (state: any) => ({
		...state,
		open: false
	}),
	toggleOpen: (state: any) => ({
		...state,
		open: !state.open
	}),
	isOpen: 'boolean',
	title: 'string'
};


export const UITabs = ({ state, setState, setGlobalState, sendSignal }: {
	state: TabsState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'tabs') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Tabs
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
	onClick={() => sendSignal(state.id, 'click')}
	>
		{
			state.items?.map((tab: any, index: number) => {
				const setTabItem = (i: any) => setItemInState(i, tab, setState);
				return <Tab
					className={cx(tab.className, tab.cssClasses?.map((cc: any) => cc.id).join(' '))}
					onClick= {() => state.selectedTab = index}
					key={index}
					disabled={tab.disabled}
					label={tab.labelText}>
						{
							tab.items?.map((item: any) => {
								const setItem = (i: any) => setItemInState(i, item, setTabItem);
								return renderComponents(item, setItem, setGlobalState, sendSignal);
							})
						}
				</Tab>;
			})
		}
	</Tabs>;
};
