import React from 'react';
import { css } from 'emotion';
import { getAllFragmentStyleClasses, renderComponents } from './utils';

export interface UIFragmentProps {
	state: any;
	setState: (state: any) => void;
}

export const UIFragment = ({ state, setState }: UIFragmentProps) => {
	const styles = css`${
		getAllFragmentStyleClasses(state, [], state.allCssClasses).map((styleClass: any) => `.${styleClass.id} {
			${styleClass.content}
		}`)
	}`;

	const setStateData = (stateData: any) => {
		setState({
			...state,
			data: {
				...stateData
			}
		});
	};

	// state.data and setStateData render fragment json; state and setState render component json
	return <div className={styles}>
		{ renderComponents(state.data || state, state.data ? setStateData : setState, setStateData) }
	</div>;
};
