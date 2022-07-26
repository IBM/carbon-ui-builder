import React from 'react';
import { BreadcrumbItem } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface BreadcrumbItemState {
	type: string;
	items?: any[]; // TODO type
	href?: string;
	id: string | number;
	label: string;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIBreadcrumbItem = ({ state }: {
	state: BreadcrumbItemState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'breadcrumb-item') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <BreadcrumbItem
	href={state.href}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{ state.label }
	</BreadcrumbItem>;
};
