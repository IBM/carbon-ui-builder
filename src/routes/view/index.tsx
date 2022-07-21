import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalStateContext } from '../../context';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';

export const View = () => {
	const {
		fragments
	} = useContext(GlobalStateContext);

	const params = useParams();

	const fragment = fragments.find((fragment: any) => fragment.id === params.id);

	const [fragmentState, setFragmentState] = useState(fragment.data);

	return <UIFragment state={fragmentState} setState={(state) => setFragmentState(state)} />;
};
