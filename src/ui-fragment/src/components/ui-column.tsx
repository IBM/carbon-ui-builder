import React from 'react';
import { Column } from 'carbon-components-react';
import { CssClasses } from '../types';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';

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
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UIColumn = ({ state, setState, setGlobalState, sendSignal }: {
	state: ColumnState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'column') {
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

	return <Column
	className={cssClasses}
	sm={{ span: state.smallSpan || undefined, offset: state.smallOffset || undefined }}
	md={{ span: state.mediumSpan || undefined, offset: state.mediumOffset || undefined }}
	lg={{ span: state.largeSpan || undefined, offset: state.largeOffset || undefined }}
	xlg={{ span: state.xLargeSpan || undefined, offset: state.xLargeOffset || undefined }}
	max={{ span: state.maxSpan || undefined, offset: state.maxOffset || undefined }}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</Column>;
};
