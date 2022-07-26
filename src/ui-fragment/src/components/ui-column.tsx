import React from 'react';
import { Column } from 'carbon-components-react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface ColumnState {
	type: string;
	items: any[]; // TODO row type
	id: string | number;
	smallSpan?: number;
	smallOffset?: number;
	mediumSpan?: number;
	mediumOffset?: number;
	largeSpan?: number;
	largeOffset?: number;
	xLargeSpan?: number;
	xLargeOffset?: number;
	maxSpan?: number;
	maxOffset?: number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIColumn = ({ state, setState, setGlobalState }: {
	state: ColumnState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'column') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Column
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
	sm={{ span: state.smallSpan || undefined, offset: state.smallOffset || undefined }}
	md={{ span: state.mediumSpan || undefined, offset: state.mediumOffset || undefined }}
	lg={{ span: state.largeSpan || undefined, offset: state.largeOffset || undefined }}
	xlg={{ span: state.xLargeSpan || undefined, offset: state.xLargeOffset || undefined }}
	max={{ span: state.maxSpan || undefined, offset: state.maxOffset || undefined }}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState);
			})
		}
	</Column>;
};
