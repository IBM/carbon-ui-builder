import React, {
	createContext,
	useEffect,
	useContext,
	useState
} from 'react';
import { useHistory } from 'react-router';
import assign from 'lodash/assign';

const FragmentsContext: React.Context<any> = createContext(null);
FragmentsContext.displayName = 'FragmentsContext';

export interface FragmentState {
	currentId: string | null,
	fragments: any[],
	loaded?: boolean
}

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

	const { fragmentsState, updateOne } = context;

	if (!id) {
		const location = history.location.pathname;
		const pathSegments = location.split('/');
		id = `${fragmentsState.currentId || pathSegments[pathSegments.length - 1]}`
	}

	const fragment = fragmentsState.fragments.find((fragment: any) => fragment.id === id);
	const setFragment = (fragment: any) => {
		updateOne(fragment);
	};
	return [fragment, setFragment];
};

const validInitialFragments = (localFragments: any[] | undefined) => {
	if (!localFragments || !Array.isArray(localFragments)) {
		return [];
	}

	return localFragments.filter((fragment: any) => !!fragment.id && typeof fragment.id === 'string');
};

const FragmentsContextProvider = ({ children }: any) => {
	const [fragmentsState, _setFragmentsState] = useState<FragmentState>({
		fragments: validInitialFragments(JSON.parse(localStorage.getItem('localFragments') as string)) || [],
		currentId: null
	});

	const updateAll = (fs: FragmentState, loaded = true) => {
		if (!fragmentsState.fragments || !fragmentsState.fragments.length) {
			_setFragmentsState({
				...fragmentsState,
				fragments: fs.fragments,
				currentId: null,
				loaded
			});
			return;
		}

		// Remove fragments which are in the original state but not in the payload.
		const filteredFragments = fragmentsState.fragments
			.filter((fragment: any) => fs.fragments.some((actionFragment: any) => actionFragment.id === fragment.id));
		// If fragments already exist in the state, we need to merge any changes to the fragments with
		// the current matching fragments and add any new fragments (if any) to the state.
		const mergedFragments = filteredFragments.map((fragment: any) => {
		// Find the fragment in the payload containing the same id as the current state's fragments
		// to merge updated changes with.
			const updatedFragment = fs.fragments.find((actionFragment: any) => fragment.id === actionFragment.id);
			// Can not use merge because removing datasets or labels will not
			// work since it keeps the values, while assign overwrites past values.
			return assign({}, fragment, updatedFragment);
		});
		// Adds any fragments in the payload which do not match any id in the current state's fragments.
		const updatedFragments = mergedFragments
			.concat(fs.fragments.filter((actionFragment: any) => (
				fragmentsState.fragments.every((fragment: any) => fragment.id !== actionFragment.id)
			)));

		_setFragmentsState({
			...fragmentsState,
			fragments: updatedFragments,
			currentId: null,
			loaded
		});
	}

	const toggleVisibility = (id: string, hidden = false, loaded = true) => {
		const fragmentToHide = fragmentsState.fragments.find((fragment: any) => fragment.id === id);
		fragmentToHide.hidden = hidden;
		_setFragmentsState({
			...fragmentsState,
			currentId: id,
			loaded
		});
	}

	const removeFragment = (id: string, loaded = true) => {
		_setFragmentsState({
			...fragmentsState,
			fragments: fragmentsState.fragments.filter((fragment: any) => fragment.id !== id),
			currentId: id,
			loaded
		});
	}

	const removeFragments = (ids: string[], loaded = true) => {
		const remainingFragments = fragmentsState.fragments.filter((fragment: any) => (
			!ids.some((actionFragment: any) => actionFragment.id === fragment.id)
		));
		_setFragmentsState({
			...fragmentsState,
			fragments: remainingFragments,
			currentId: null,
			loaded
		});
	}

	const fetchOne = (id: string) => {
		_setFragmentsState({
			...fragmentsState,
			currentId: id,
			loaded: true
		});
	}

	const updateOne = (fragment: any, loaded = true) => {
		if (!fragmentsState.fragments.length) {
			_setFragmentsState({
				fragments: [fragment],
				currentId: fragment.id,
				loaded
			});
			return;
		}
		const updatedFragmentState = fragmentsState.fragments.map((f: any) => {
			if (f.id === fragment.id) {
				// Cannot use merge because removing datasets or labels will not
				// work since it keeps the values, while assign overwrites past values.
				return assign({}, f, fragment);
			}
			return f;
		});
	
		_setFragmentsState({
			...fragmentsState,
			fragments: updatedFragmentState,
			currentId: fragment.id,
			loaded
		});
	};

	const addOne = (fragment: any, loaded = true) => {
		const duplicate = assign({}, fragment);
		const expandedFragments = fragmentsState.fragments.concat(duplicate);
		_setFragmentsState({
			...fragmentsState,
			fragments: expandedFragments,
			currentId: fragment.id,
			loaded
		});
	}

	useEffect(() => {
		const localFragments = JSON.parse(localStorage.getItem('localFragments') as string || '[]');
		// clean up the hidden fragments (those marked for deletion but failed to be deleted)
		const filteredFragments = localFragments.filter((fragment: any) => !fragment.hidden);
		updateAll({
			fragments: filteredFragments,
			currentId: null
		});
		localStorage.setItem('localFragments', JSON.stringify(filteredFragments));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// store only ids to local storage so we don't get into temptation of using other
		// props that should really be coming from db
		localStorage.setItem('localFragments', JSON.stringify(fragmentsState.fragments));
	}, [fragmentsState.fragments]);

	return (
		<FragmentsContext.Provider value={{
			addOne,
			fragmentsState,
			updateAll,
			toggleVisibility,
			fetchOne,
			removeFragment,
			removeFragments,
			updateOne
		}}>
			{children}
		</FragmentsContext.Provider>
	);
};

export {
	FragmentsContext,
	FragmentsContextProvider
};
