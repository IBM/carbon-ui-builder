import React from 'react';
import { css } from 'emotion';
import { getAllFragmentStyleClasses, renderComponents } from './utils';
import { Action, SendSignal } from './types';

import { allComponents } from './components';

export interface UIFragmentProps {
	state: any;
	setState: (state: any) => void;
}

const slotsFromType = (type: string) => {
	const componentModule = Object.values(allComponents).find(component => 'type' in component && component.type === type);
	return componentModule && 'slots' in componentModule ? componentModule.slots : {};
};

const updatedStateData = (stateData: any, actions: Action[], signalValue?: any[], newSenderState?: any) => {
	let newStateData = {
		...stateData
	};

	if (stateData.id === newSenderState?.id) {
		newStateData = { ...newSenderState };
	}

	const action = actions.find((a: Action) => a.destination === stateData.id);

	if (action) {
		// check if slot is a function
		const slots = slotsFromType(stateData.type);
		// TODO signalValue needs to be correctly mapped to slots and/or to function calls
		if (action.slot in slots && typeof (slots as any)[action.slot] === 'function') {
			newStateData = (slots as any)[action.slot](stateData, signalValue);
		} else {
			newStateData[action.slot] = signalValue !== undefined && Array.isArray(signalValue) ? signalValue[0] : action.slotParam;
		}
	}

	return {
		...newStateData,
		items: stateData?.items?.map((item: any) => updatedStateData(item, actions, signalValue, newSenderState))
	};
};

export const UIFragment = ({ state, setState }: UIFragmentProps) => {
	const styles = css`${
		getAllFragmentStyleClasses(state, [], state.allCssClasses).map((styleClass: any) => `.${styleClass.id} {
			${styleClass.content}
		}`)
	}`;

	const setStateData = (stateData: any) => {
		setState((state: any) => ({
			...state,
			data: {
				...(typeof stateData === 'function' ? stateData(state.data) : stateData)
			}
		}));
	};

	const sendSignal: SendSignal = (id: number | string, signal: string, value?: any[], newComponentState?: any) => {
		if (!state.data.actions) {
			return;
		}

		const subscriptions = state.data.actions.filter((action: Action) => action.source === id && action.signal === signal);

		setStateData((stateData: any) => updatedStateData(stateData, subscriptions, value, newComponentState));
	};

	// state.data and setStateData render fragment json; state and setState render component json
	// setStateData is setGlobalData
	return <div className={styles}>
		{ renderComponents(state.data || state, state.data ? setStateData : setState, setStateData, sendSignal) }
	</div>;
};
