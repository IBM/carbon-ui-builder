import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalStateContext } from '../../context';
import { UIFragment } from '@carbon-builder/player-react';

export const View = () => {
	const { fragments, getExpandedFragmentState } = useContext(GlobalStateContext);

	const params = useParams();

	const fragment = fragments.find((fragment: any) => fragment.id === params.id);

	const [fragmentState, setFragmentState] = useState(getExpandedFragmentState(fragment));

	return <UIFragment
		state={fragmentState}
		setState={(state) => setFragmentState(state)} />;
};
