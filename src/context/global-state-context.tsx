import React, {
	createContext,
	useEffect,
	useContext,
	useState
} from 'react';
import { useHistory } from 'react-router';
import assign from 'lodash/assign';
import { getFragmentHelpers } from './fragments-context-helper';

const GlobalStateContext: React.Context<any> = createContext(null);
GlobalStateContext.displayName = 'GlobalStateContext';

export const useFragment = (id?: string) => {
	const context = useContext(GlobalStateContext);
	const history = useHistory();

	if (!context) {
		// this happens when rendering, which is fine because it's used
		// in AComponent to update the state of the whole fragment due to
		// user interaction - functionality not needed for render only
		console.info("Rendering only, won't be able to update context");
		return [{}, (_: any) => {}];
	}

	const { fragments, updateFragment } = context;

	if (!id) {
		const location = history.location.pathname;
		const pathSegments = location.split('/');
		id = pathSegments[pathSegments.length - 1];
	}

	const fragment = fragments.find((fragment: any) => fragment.id === id);
	const setFragment = (fragment: any) => {
		updateFragment(fragment);
	};
	return [fragment, setFragment];
};

const validInitialFragments = (localFragments: any[] | undefined) => {
	if (!localFragments || !Array.isArray(localFragments)) {
		return [];
	}

	return localFragments.filter((fragment: any) => !!fragment.id && typeof fragment.id === 'string');
};

const GlobalStateContextProvider = ({ children }: any) => {
	const [fragments, _setFragments] = useState<any[]>(
		validInitialFragments(JSON.parse(localStorage.getItem('localFragments') as string)) || []
	);
	const [actionHistory, setActionHistory] = useState([] as any[]);
	const [actionHistoryIndex, setActionHistoryIndex] = useState(-1);

	const setFragments = (frags: any[]) => {
		_setFragments(frags);
		localStorage.setItem('localFragments', JSON.stringify(frags));
	}

	const addAction = (action: any) => {
		const newActionHistoryIndex = actionHistoryIndex + 1;
		setActionHistoryIndex(newActionHistoryIndex);

		const actionClone = JSON.parse(JSON.stringify(action));

		setActionHistory([...actionHistory.slice(0, newActionHistoryIndex), actionClone]);
	};

	const canUndo = () => actionHistoryIndex > 0;

	const undoAction = () => {
		if (!canUndo()) {
			return;
		}

		const newActionHistoryIndex = actionHistoryIndex - 1;
		const action = actionHistory[newActionHistoryIndex];

		// if there was a change in fragment
		if (action.fragment) {
			updateFragment(action.fragment, false);
		}

		setActionHistoryIndex(newActionHistoryIndex);
	};

	const canRedo = () => actionHistoryIndex < actionHistory.length - 1;

	const redoAction = () => {
		if (!canRedo()) {
			return;
		}

		const newActionHistoryIndex = actionHistoryIndex + 1;
		const action = actionHistory[newActionHistoryIndex];

		// if there was a change in fragment
		if (action.fragment) {
			updateFragment(action.fragment, false);
		}
		setActionHistoryIndex(newActionHistoryIndex);
	};

	const clearActionHistory = () => {
		setActionHistoryIndex(-1);
		setActionHistory([]);
	};

	const updateFragment = (fragment: any, updateActionHistory = true) => {
		console.log("updating fragment", fragment)
		if (!fragments.length) {
			setFragments([fragment]);
			return;
		}
		const updatedFragments = fragments.map((f: any) => {
			if (f.id === fragment.id) {
				// Cannot use merge because removing datasets or labels will not
				// work since it keeps the values, while assign overwrites past values.
				return assign({}, f, fragment);
			}
			return f;
		});

		setFragments(updatedFragments);

		if (updateActionHistory) {
			addAction({fragment});
		}
	};

	const fragmentHelpers = getFragmentHelpers({fragments, setFragments});

	useEffect(() => {
		const localFragments = JSON.parse(localStorage.getItem('localFragments') as string || '[]');
		// clean up the hidden fragments (those marked for deletion but failed to be deleted)
		const filteredFragments = localFragments.filter((fragment: any) => !fragment.hidden);
		fragmentHelpers.updateFragments(filteredFragments);
		localStorage.setItem('localFragments', JSON.stringify(filteredFragments));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<GlobalStateContext.Provider value={{
			fragments,
			setFragments,
			updateFragment,
			...fragmentHelpers,
			actionHistory,
			actionHistoryIndex,
			setActionHistory,
			setActionHistoryIndex,
			addAction,
			canUndo,
			undoAction,
			canRedo,
			redoAction,
			clearActionHistory
		}}>
			{children}
		</GlobalStateContext.Provider>
	);
};

export {
	GlobalStateContext,
	GlobalStateContextProvider
};
