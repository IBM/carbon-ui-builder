import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalStateContext } from '../../context';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';
import { getAllFragmentStyleClasses } from '../../ui-fragment/src/utils';

export const View = () => {
	const { fragments, styleClasses } = useContext(GlobalStateContext);

	const params = useParams();

	const fragment = fragments.find((fragment: any) => fragment.id === params.id);

	const [fragmentState, setFragmentState] = useState(fragment);

	return <UIFragment
		state={{
			...fragmentState,
			allCssClasses: getAllFragmentStyleClasses(fragmentState, [], styleClasses)
		}}
		setState={(state) => setFragmentState(state)} />;
};
