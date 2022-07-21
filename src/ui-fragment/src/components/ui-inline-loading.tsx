import React from 'react';
import { InlineLoading } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface InlineLoadingState {
	type: string;
	status: string;
	textDescription: string;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIInlineLoading = ({ state }: {
	state: InlineLoadingState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'inlineloading') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <InlineLoading
		description={state.textDescription}
		status={state.status}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
