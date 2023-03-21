import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalStateContext } from '../../context';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';

export const View = () => {
	const { fragments, getExpandedFragmentState } = useContext(GlobalStateContext);

	const params = useParams();

	// Gets JSON from editor
	const fragment = fragments.find((fragment: any) => fragment.id === params.id);

	// Converts JSON to React State
	const [fragmentState, setFragmentState] = useState(getExpandedFragmentState(fragment));

	return <UIFragment
		state={fragmentState}
		setState={(state) => setFragmentState(state)} />;
};
