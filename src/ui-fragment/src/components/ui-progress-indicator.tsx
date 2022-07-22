import React from 'react';
import { ProgressIndicator, ProgressStep } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface ProgressIndicatorState {
	type: string;
	id: string | number;
	progressSteps: {
		label: string;
		invalid?: boolean;
		disabled?: boolean;
		secondaryLabel?: string;
		description?: string;
	}[];
	currentIndex?: number;
	isVertical?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIProgressIndicator = ({ state, setState }: {
	state: ProgressIndicatorState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'progress-indicator') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <ProgressIndicator
	currentIndex={state.currentIndex || 0}
	vertical={state.isVertical}
	onChange={(selectedStep: number) => setState({ ...state, currentIndex: selectedStep })}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.progressSteps?.map((step: any) => <ProgressStep
				key={step.label}
				label={step.label}
				invalid={step.invalid}
				disabled={step.disabled}
				secondaryLabel={step.secondaryLabel}
				description={step.description} />)
		}
	</ProgressIndicator>;
};
