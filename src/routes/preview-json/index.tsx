import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';
import JSONCrush from 'jsoncrush';

export const PreviewJson = () => {
	const [state, setState] = useState({
		fragmentState: {} as any,
		parseSucceeded: true
	});

	const params = useParams();

	const setFragmentState = (fragmentState: any) => {
		setState((state: any) => ({
			...state,
			fragmentState: (typeof fragmentState === 'function' ? fragmentState(state.fragmentState) : fragmentState)
		}));
	};

	useEffect(() => {
		try {
			// try parsing regular json
			setState({
				fragmentState: JSON.parse(params.json || ''),
				parseSucceeded: true
			});
		} catch (error) {
			// it's not regular json, so maybe it's crushed
			try {
				setState({
					fragmentState: JSON.parse(JSONCrush.uncrush(params.json || '')),
					parseSucceeded: true
				});
			} catch (error) {
				// it's neither regular or crushed, bail
				setState({
					fragmentState: {},
					parseSucceeded: false
				});
			}
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
