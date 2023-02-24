import React from 'react';
import { css } from 'emotion';
import { renderComponents } from './utils';
import { Action } from './types';
import { contentType } from 'mime-types';
import { sign } from 'crypto';

// THIS IS WHERE HANDLERS ARE GOING

export interface UIFragmentProps {
	state: any;
	setState: (state: any) => void;
}

export const UIFragment = ({ state, setState }: UIFragmentProps) => {

	const styles = css`${
		Object.values(state.allCssClasses || []).map((styleClass: any) => `.${styleClass.id} {
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

	// console.log(JSON.stringify(state))

	const sendSignal = (id: number | string, signal: string) => {
		// console.log('handleSignalStart: ' + JSON.stringify(state))

		if (!state.data.actions) {
			return;
		}

		let changedItems = JSON.parse(JSON.stringify(state.data.items))

		state.data.actions.forEach((action: Action) => {
			if (!(action.source == id && action.signal == signal)) {
				return;
			}

			changedItems.forEach((item: any) => {
				if (item.id == action.destination) {
					item[action.slot] = action.slot_param
				}
			})
		})

		setStateData({
			...state.data,
			items: changedItems
		})
		
		// console.log('handleSignalEnd: ' + JSON.stringify(state))

	}

	// const iterMatches = (state: any) => {
	// 	if (Object(state) !== state) return; // A primitive
	// 	for (const [key, value] of Object.entries(state)) {
	// 		if (value instanceof Object) {
	// 			iterMatches(value)
	// 		} else if (key == 'id' && value == 14) {
	// 			value = 
	// 		}
	// 	}
	// 	return state
	// }

	// iterMatches(state)

	// state.data and setStateData render fragment json; state and setState render component json
	// setStateData is setGlobalData
	// PASS in the global state so components can see!!!!
	return <div className={styles}>
		{ renderComponents(state.data || state, state.data ? setStateData : setState, setStateData, sendSignal) }
	</div>;
};
