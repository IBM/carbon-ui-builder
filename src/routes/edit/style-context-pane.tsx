import React from 'react';

import { getSelectedComponent, updatedState } from '../../components/fragment';

import { allComponents } from '../../fragment-components';

import { SelectedComponentBreadcrumbs } from './selected-component-breadcrumbs';

const showComponentStyleOptions = (selectedComponent: any, setComponent: any) => {
	for (let [key, component] of Object.entries(allComponents)) {
		// Find the UI for editing style for our component
		if (selectedComponent.type === key) {
			return <component.componentInfo.styleUI
				selectedComponent={selectedComponent}
				setComponent={setComponent} />
		}
	}
};

export const StyleContextPane = ({fragment, setFragment}: any) => {
	const selectedComponent = getSelectedComponent(fragment);

	const setComponent = (component: any, updateActionHistory = true) => {
		setFragment({
				...fragment,
				data: updatedState(fragment.data, {
					type: 'update',
					component
				})
			},
			updateActionHistory
		);
	};

	return (
		<div>
			{
				selectedComponent && <>
					<SelectedComponentBreadcrumbs
						fragment={fragment}
						selectedComponent={selectedComponent}
						setFragment={setFragment} />
					<hr />
					<div className='context-pane-content'>
						{showComponentStyleOptions(selectedComponent, setComponent)}
					</div>
				</>
			}
		</div>
	);
};
