import React from 'react';
import { Breadcrumb } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';
import { BreadcrumbItemState } from './ui-breadcrumb-item';

export interface BreadcrumbState {
	type: string;
	items: BreadcrumbItemState[];
	id: string | number;
	noTrailingSlash?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIBreadcrumb = ({ state, setState, setGlobalState }: {
	state: BreadcrumbState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'breadcrumb') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Breadcrumb
	noTrailingSlash={state.noTrailingSlash}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</Breadcrumb>;
};
