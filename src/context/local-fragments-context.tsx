import React, { createContext, useReducer } from 'react';

const LocalFragmentsContext: React.Context<any> = createContext(null);

LocalFragmentsContext.displayName = 'LocalFragmentsContext';

export enum LocalFragmentActionType {
	ADD,
	REMOVE
}

export interface LocalFragmentAction {
	type: LocalFragmentActionType,
	data: any
}

const fragmentsReducer = (state: any[], action: any) => {
	switch (action.type) {
		case LocalFragmentActionType.REMOVE: {
			const ci = state.findIndex((c: any) => c.id === action.data.id);
			return [
				...state.slice(0, ci),
				...state.slice(ci + 1)
			];
		}
		default:
		case LocalFragmentActionType.ADD:
			return [...state, action.data];
	}
};

const validInitialState = (localFragments: any[] | undefined) => {
	if (!localFragments || !Array.isArray(localFragments)) {
		return [];
	}

	// sanitize localFragments in case they've been modified by third party
	return localFragments
		.filter((fragment: any) => !!fragment.id && typeof fragment.id === 'string')
		.map((fragment: any) => ({ id: fragment.id }));
};

const LocalFragmentsContextProvider = ({ children }: any) => {
	const initialState: any[] = validInitialState(JSON.parse(localStorage.getItem('localFragments') as string));
	const store = useReducer(fragmentsReducer, initialState);
	const [fragments] = store;

	React.useEffect(() => {
		// store only ids to local storage so we don't get into temptation of using other
		// props that should really be coming from db
		localStorage.setItem('localFragments', JSON.stringify(fragments.map((lc: any) => ({ id: lc.id }))));
	}, [fragments]);

	return (
		<LocalFragmentsContext.Provider value={store}>
			{children}
		</LocalFragmentsContext.Provider>
	);
};

export {
	LocalFragmentsContext,
	LocalFragmentsContextProvider
};
