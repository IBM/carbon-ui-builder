import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';

export const PreviewJson = () => {
	const [state, setState] = useState({
		fragmentState: {} as any,
		parseSucceeded: true
	});

	const params = useParams();

	const setFragmentState = (fragmentState: any) => {
		setState({
			...state,
			fragmentState
		});
	};

	useEffect(() => {
		try {
			setState({
				fragmentState: JSON.parse(params.json || ''),
				parseSucceeded: true
			});
		} catch (error) {
			setState({
				fragmentState: {},
				parseSucceeded: false
			});
		}
	}, [params]);

	return <>
		{
			state.parseSucceeded
				? <UIFragment state={state.fragmentState} setState={setFragmentState} />
				: 'Failed to parse JSON.'
		}
	</>;
};
