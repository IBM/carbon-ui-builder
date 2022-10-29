import React from 'react';
import { Pagination } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface PaginationState {
	type: string;
	cssClasses?: CssClasses[];
	backwardText: string;
	forwardText: string;
	disabled: boolean;
	totalItems: number;
	page: number;
	isLastPage: boolean;
	pageSizeInputDisabled: boolean;
	pagesUnknown: boolean;
	pageSize: number;
	pageSizes: number[];
	itemsPerPageText: string;
	pageNumberText: string;
	size: string;
	codeContext?: {
		name: string;
	};
}

export const UIPagination = ({ state }: {
	state: PaginationState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'pagination') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Pagination
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
		backwardText={state.backwardText}
		forwardText={state.forwardText}
		itemsPerPageText={state.itemsPerPageText}
		page={state.page}
		pageNumberText={state.pageNumberText}
		pageSize={state.pageSize}
		pageSizeInputDisabled={state.pageSizeInputDisabled}
		disabled={state.disabled}
		isLastPage={state.isLastPage}
		pagesUnknown={state.pagesUnknown}
		size={state.size}
		pageSizes={[
			10,
			20,
			30,
			40,
			50
		]}
		totalItems={state.totalItems} />;
};
