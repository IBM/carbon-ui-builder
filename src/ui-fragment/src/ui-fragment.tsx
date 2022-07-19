import React from 'react';
import { UIButton } from './components/ui-button';

export interface UIFragmentProps {
	state: any;
	setState: (state: any) => void;
}

const renderComponents = (state: any, setState: (state: any) => void, setGlobalState: (state: any) => void) => {
	switch (state.type) {
		case 'button':
			return <UIButton state={state} setState={setState} setGlobalState={setGlobalState} />;

		default:
			break;
	}

	if (state.items && Array.isArray(state.items)) {
		// setItem is a setState for that particular item
		const setItem = (item: any) => {
			const itemIndex = state.items.indexOf(item);
			setState({
				...state,
				items: [
					...state.items.slice(0, itemIndex),
					item,
					...state.items.slice(itemIndex + 1)
				]
			});
		};

		return state.items.map((item: any) => renderComponents(item, setItem, setState));
	}
};

export const UIFragment = ({ state, setState }: UIFragmentProps) => {
	return renderComponents(state, setState, setState);
};
