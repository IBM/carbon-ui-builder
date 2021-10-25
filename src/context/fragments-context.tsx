import React, {
	createContext,
	useReducer,
	useEffect,
	useContext
} from 'react';
import { useHistory } from 'react-router';
import assign from 'lodash/assign';

const FragmentsContext: React.Context<any> = createContext(null);
FragmentsContext.displayName = 'FragmentsContext';

export enum FragmentActionType {
	ADD_ONE,
	FETCH_ONE,
	TOGGLE_VISIBILITY,
	REMOVE_FRAGMENT,
	REMOVE_FRAGMENTS,
	UPDATE_ALL,
	UPDATE_ONE
}

export type FragmentAction =
	FragmentActionAddOne |
	FragmentActionFetchOne |
	FragmentActionRemoveFragment |
	FragmentActionToggleVisibility |
	FragmentActionRemoveFragments |
	FragmentActionUpdateAll |
	FragmentActionUpdateOne;

export interface BaseFragmentAction {
	type: FragmentActionType
	loaded: boolean;
}

export interface FragmentActionAddOne extends BaseFragmentAction {
	type: FragmentActionType.ADD_ONE;
	data: any;
}

export interface FragmentActionFetchOne extends BaseFragmentAction {
	type: FragmentActionType.FETCH_ONE;
	data: any;
}

export interface FragmentActionRemoveFragment extends BaseFragmentAction {
	type: FragmentActionType.REMOVE_FRAGMENT;
	id: string;
	shouldRemove: boolean;
}

export interface FragmentActionToggleVisibility extends BaseFragmentAction {
	type: FragmentActionType.TOGGLE_VISIBILITY;
	id: string;
	hidden: boolean;
}

export interface FragmentActionRemoveFragments extends BaseFragmentAction {
	type: FragmentActionType.REMOVE_FRAGMENTS;
	ids: string[];
}

export interface FragmentActionUpdateAll extends BaseFragmentAction {
	type: FragmentActionType.UPDATE_ALL;
	data: any;
}

export interface FragmentActionUpdateOne extends BaseFragmentAction {
	type: FragmentActionType.UPDATE_ONE;
	data: any;
}

export interface FragmentState {
	currentId: string | null,
	fragments: any[],
	loaded: boolean
}

export const useFetchOne = (id: number, dispatch: any) => {
	useEffect(() => {
		dispatch({
			type: FragmentActionType.FETCH_ONE,
			data: id
		});
	}, [dispatch, id]);
};

export const useFragment = (id?: string) => {
	const context = useContext(FragmentsContext);
	const history = useHistory();

	if (!context) {
		// this happens when rendering, which is fine because it's used
		// in AComponent to update the state of the whole fragment due to
		// user interaction - functionality not needed for render only
		console.info("Rendering only, won't be able to update context");
		return [{}, (_: any) => {}];
	}

	const [state, dispatch] = context;

	if (!id) {
		const location = history.location.pathname;
		const pathSegments = location.split('/');
		id = `${state.currentId || pathSegments[pathSegments.length - 1]}`
	}

	const fragment = state.fragments.find((fragment: any) => fragment.id === id);
	const setFragment = (fragment: any) => {
		dispatch({
			type: FragmentActionType.UPDATE_ONE,
			data: fragment,
			loaded: true
		});
	};
	return [fragment, setFragment];
};


const updateOne = (
	state: FragmentState,
	action: FragmentActionUpdateOne
) => {
	if (!state.fragments.length) {
		return {
			fragments: [action.data],
			loaded: action.loaded,
			currentId: action.data.id
		};
	}
	const updatedFragmentState = state.fragments.map((fragment: any) => {
		if (fragment.id === action.data.id) {
			// Cannot use merge because removing datasets or labels will not
			// work since it keeps the values, while assign overwrites past values.
			return assign({}, fragment, action.data);
		}
		return fragment;
	});

	return {
		...state,
		fragments: updatedFragmentState,
		loaded: action.loaded,
		currentId: action.data.id
	};
};

const fragmentsReducer = (state: FragmentState, action: FragmentAction) => {
	switch (action.type) {
		case FragmentActionType.FETCH_ONE:
			return {
				...state,
				currentId: action.data,
				loaded: true
			};
		case FragmentActionType.UPDATE_ALL: {
			if (!state.fragments || !state.fragments.length) {
				return {
					...state,
					fragments: action.data,
					loaded: action.loaded,
					currentId: null
				};
			}

			// Remove fragments which are in the original state but not in the payload.
			const filteredFragments = state.fragments
				.filter((fragment: any) => action.data.some((actionFragment: any) => actionFragment.id === fragment.id));
			// If fragments already exist in the state, we need to merge any changes to the fragments with
			// the current matching fragments and add any new fragments (if any) to the state.
			const mergedFragments = filteredFragments.map((fragment: any) => {
			// Find the fragment in the payload containing the same id as the current state's fragments
			// to merge updated changes with.
				const updatedFragment = action.data.find((actionFragment: any) => fragment.id === actionFragment.id);
				// Can not use merge because removing datasets or labels will not
				// work since it keeps the values, while assign overwrites past values.
				return assign({}, fragment, updatedFragment);
			});
			// Adds any fragments in the payload which do not match any id in the current state's fragments.
			const updatedFragments = mergedFragments
				.concat(action.data.filter((actionFragment: any) => (
					state.fragments.every((fragment: any) => fragment.id !== actionFragment.id)
				)));
			return {
				...state,
				fragments: updatedFragments,
				loaded: action.loaded,
				currentId: null
			};
		}
		case FragmentActionType.UPDATE_ONE:
			return updateOne(state, action);
		case FragmentActionType.REMOVE_FRAGMENT: {
			return {
				...state,
				fragments: state.fragments.filter((fragment: any) => fragment.id !== action.id),
				loaded: action.loaded,
				currentId: action.id
			};
		}
		case FragmentActionType.TOGGLE_VISIBILITY: {
			const fragmentToHide = state.fragments.find((fragment: any) => fragment.id === action.id);
			fragmentToHide.hidden = action.hidden;
			return {
				...state,
				loaded: action.loaded,
				currentId: action.id
			};
		}
		case FragmentActionType.REMOVE_FRAGMENTS: {
			const remainingFragments = state.fragments.filter((fragment: any) => (
				!action.ids.some((actionFragment: any) => actionFragment.id === fragment.id)
			));
			return {
				...state,
				fragments: remainingFragments,
				loaded: action.loaded,
				currentId: null
			};
		}
		case FragmentActionType.ADD_ONE: {
			const duplicate = assign({}, action.data);
			const expandedFragments = state.fragments.concat(duplicate);
			return {
				...state,
				fragments: expandedFragments,
				loaded: action.loaded,
				currentId: action.data.id
			};
		}
		default:
			return state;
	}
};

const validInitialFragments = (localFragments: any[] | undefined) => {
	if (!localFragments || !Array.isArray(localFragments)) {
		return [];
	}

	return localFragments.filter((fragment: any) => !!fragment.id && typeof fragment.id === 'string');
};

const FragmentsContextProvider = ({ children }: any) => {
	const initialState: any = {
		fragments: validInitialFragments(JSON.parse(localStorage.getItem('localFragments') as string)),
		loaded: false,
		currentId: null
	};
	const store = useReducer(fragmentsReducer, initialState);
	const [state, dispatch] = store;

	useEffect(() => {
		const localFragments = JSON.parse(localStorage.getItem('localFragments') as string || '[]');
		// clean up the hidden fragments (those marked for deletion but failed to be deleted)
		const filteredFragments = localFragments.filter((fragment: any) => !fragment.hidden);
		dispatch({
			type: FragmentActionType.UPDATE_ALL,
			data: filteredFragments,
			loaded: true
		});
		localStorage.setItem('localFragments', JSON.stringify(filteredFragments));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// store only ids to local storage so we don't get into temptation of using other
		// props that should really be coming from db
		localStorage.setItem('localFragments', JSON.stringify(state.fragments));
	}, [state.fragments]);

	return (
		<FragmentsContext.Provider value={store}>
			{children}
		</FragmentsContext.Provider>
	);
};

export {
	FragmentsContext,
	FragmentsContextProvider
};
