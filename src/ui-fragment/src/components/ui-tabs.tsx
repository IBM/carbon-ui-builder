import React from 'react';
import { Tabs, Tab } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';
import { cx } from 'emotion';

export interface TabsState {
	type: string;
	id: string | number;
	items?: [],
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

export const UITabs = ({ state, setState, setGlobalState }: {
	state: TabsState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'tabs') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Tabs
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
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
								return renderComponents(item, setItem, setGlobalState);
							})
						}
				</Tab>;
			})
		}
	</Tabs>;
};
