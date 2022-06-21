import assign from 'lodash/assign';

export const getFragmentHelpers = ({ fragments, setFragments }: any) => {
	const addFragment = (fragment: any) => {
		setFragments([...fragments, { ...fragment }]);
	};

	const getFragment = (fragmentId: string) => fragments.find((f: any) => f.id === fragmentId);

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
	};

	const toggleFragmentVisibility = (id: string, hidden = false) => {
		const updatedFragments = fragments.map((f: any) => {
			if (f.id === id) {
				return { ...f, hidden };
			}
			return f;
		});

		setFragments(updatedFragments);
	};

	const removeFragment = (id: string) => {
		setFragments(fragments.filter((fragment: any) => fragment.id !== id));
	};

	const removeFragments = (ids: string[]) => {
		const remainingFragments = fragments.filter((fragment: any) => (
			!ids.some((actionFragment: any) => actionFragment.id === fragment.id)
		));
		setFragments(remainingFragments);
	};

	return {
		addFragment,
		getFragment,
		updateFragments,
		toggleFragmentVisibility,
		removeFragment,
		removeFragments
	};
};
