import React from 'react';

import {
	AComponentCodeUI,
	allComponents
} from '../../sdk/src/fragment-components';

import { getSelectedComponent, updatedState } from '../../sdk/src/tools';
import { ActionsConnector } from '../../sdk/src/components/actions-connector';

const showComponentCodeOptions = (selectedComponent: any, setComponent: any) => {
	for (const component of Object.values(allComponents)) {
		// Find the UI for editing code props for our component
		if (selectedComponent.type === component.componentInfo.type && component.componentInfo.codeUI) {
			return <component.componentInfo.codeUI
				selectedComponent={selectedComponent}
				setComponent={setComponent} />;
		}
	}
	return <AComponentCodeUI selectedComponent={selectedComponent} setComponent={setComponent} />;
};

export const CodeContextPane = ({ fragment, setFragment }: any) => {
	const selectedComponent = getSelectedComponent(fragment);

	const setComponent = (component: any) => {
		setFragment({
			...fragment,
			data: updatedState(fragment.data, {
				type: 'update',
				component
			})
		});
	};

	return (
		<div className='context-pane-content'>
			{
				selectedComponent
				&& <>
					{showComponentCodeOptions(selectedComponent, setComponent)}
					<h4>Actions</h4>
					<em>(experimental)</em>
					<ActionsConnector fragment={fragment} setFragment={setFragment} sourceComponent={selectedComponent} />
				</>
			}
		</div>
	);
};
