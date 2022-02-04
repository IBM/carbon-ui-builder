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

const FragmentsContextProvider = ({ children }: any) => {
	const [fragments, _setFragments] = useState<any[]>(
		validInitialFragments(JSON.parse(localStorage.getItem('localFragments') as string)) || []
	);

	const setFragments = (frags: any[]) => {
		_setFragments(frags);
		localStorage.setItem('localFragments', JSON.stringify(frags));
	}

	const updateFragments = (frags: any[]) => {
		if (!fragments || !fragments.length) {
			setFragments(frags);
			return;
		}

		// Remove fragments which are in the original state but not in the payload.
		const filteredFragments = fragments
			.filter((fragment: any) => frags.some((actionFragment: any) => actionFragment.id === fragment.id));
		// If fragments already exist in the state, we need to merge any changes to the fragments with
		// the current matching fragments and add any new fragments (if any) to the state.
		const mergedFragments = filteredFragments.map((fragment: any) => {
		// Find the fragment in the payload containing the same id as the current state's fragments
		// to merge updated changes with.
			const updatedFragment = frags.find((actionFragment: any) => fragment.id === actionFragment.id);
			// Can not use merge because removing datasets or labels will not
			// work since it keeps the values, while assign overwrites past values.
			return assign({}, fragment, updatedFragment);
		});
		// Adds any fragments in the payload which do not match any id in the current state's fragments.
		const updatedFragments = mergedFragments
			.concat(frags.filter((actionFragment: any) => (
				fragments.every((fragment: any) => fragment.id !== actionFragment.id)
			)));

		setFragments(updatedFragments);
	}

	const toggleVisibility = (id: string, hidden = false) => {
		const updatedFragments = fragments.map((f: any) => {
			if (f.id === id) {
				return {...f, hidden}
			}
			return f;
		})
		
		setFragments(updatedFragments);
	}

	const removeFragment = (id: string) => {
		setFragments(fragments.filter((fragment: any) => fragment.id !== id));
	}

	const removeFragments = (ids: string[]) => {
		const remainingFragments = fragments.filter((fragment: any) => (
			!ids.some((actionFragment: any) => actionFragment.id === fragment.id)
		));
		setFragments(remainingFragments);
	}

	const updateFragment = (fragment: any) => {
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
	};

	const addFragment = (fragment: any) => {
		const duplicate = assign({}, fragment);
		const expandedFragments = fragments.concat(duplicate);
		setFragments(expandedFragments);
	}

	useEffect(() => {
		const localFragments = JSON.parse(localStorage.getItem('localFragments') as string || '[]');
		// clean up the hidden fragments (those marked for deletion but failed to be deleted)
		const filteredFragments = localFragments.filter((fragment: any) => !fragment.hidden);
		updateFragments(filteredFragments);
		localStorage.setItem('localFragments', JSON.stringify(filteredFragments));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<FragmentsContext.Provider value={{
			fragments,
			setFragments,
			addFragment,
			updateFragments,
			toggleVisibility,
			removeFragment,
			removeFragments,
			updateFragment
		}}>
			{children}
		</FragmentsContext.Provider>
	);
};

export {
	FragmentsContext,
	FragmentsContextProvider
};
