import React from 'react';
import { BreadcrumbItem } from 'carbon-components-react';
import { commonSlots } from '../common-slots';
import { CssClasses } from '../types';

export interface BreadcrumbItemState {
	type: string;
	items?: any[]; // TODO type
	href?: string;
	id: string | number;
	label: string;
	hidden?: boolean;
	isCurrentPage?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const type = 'breadcrumb-item';

export const signals = ['click'];

export const slots = {
	...commonSlots,
	setIsCurrentPage: (state: BreadcrumbItemState) => ({
		...state,
		isCurrentPage: true
	}),
	unsetIsCurrentPage: (state: BreadcrumbItemState) => ({
		...state,
		isCurrentPage: false
	}),
	toggleIsCurrentPage: (state: BreadcrumbItemState) => ({
		...state,
		isCurrentPage: !state.isCurrentPage
	}),
	isCurrentPage: 'boolean'
};

export const UIBreadcrumbItem = ({ state, sendSignal }: {
	state: BreadcrumbItemState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'breadcrumb-item') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <BreadcrumbItem
	href={state.href}
	onClick={() => sendSignal(state.id, 'click')}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{ state.label }
	</BreadcrumbItem>;
};
