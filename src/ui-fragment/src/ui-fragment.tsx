import React from 'react';
import { css } from 'emotion';
import { getAllFragmentStyleClasses, renderComponents } from './utils';
import { Action } from './types';

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

	const sendSignal = (id: number | string, signal: string, otherStateChanges?: any) => {
		if (!state.data.actions) {
			return;
		}

		let changedItems = JSON.parse(JSON.stringify(state.data.items))

		state.data.actions.forEach((action: Action) => {
			// Check if the ID and signal combination provided match any of the actions in the state
			if (!(action.source == id && action.signal == signal)) {
				return;
			}

			// If we find an action, iterate through the state data and change the state of the components listed
			changedItems.forEach((item: any) => {
				iterateItems(item, action, otherStateChanges)
			})
		})

		setStateData({
			...state.data,
			items: changedItems
		})
	}

	const iterateItems = (item: any, action: Action, otherStateChanges: any) => {
		// Checks if there is a micro layout and begins iterating through it
		if ("items" in item) {
			item.items.forEach((childItem: any) => {
				iterateItems(childItem, action, otherStateChanges)
			})
		}
		// Allows additional state changes for use in merging set state calls that are called from a single event.
		if (otherStateChanges && item.id == otherStateChanges.id) {
			Object.assign(item, otherStateChanges);
		}
		// Perform action by changing state
		if (item.id == action.destination) {
			item[action.slot] = action.slot_param
		}
	}

	// state.data and setStateData render fragment json; state and setState render component json
	// setStateData is setGlobalData
	return <div className={styles}>
		{ renderComponents(state.data || state, state.data ? setStateData : setState, setStateData, sendSignal) }
	</div>;
};
