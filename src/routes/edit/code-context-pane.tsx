import React from 'react';

import {
	AComponentCodeUI,
	ATextInputCodeUI,
	ATextAreaCodeUI,
	ACheckboxCodeUI
} from '../../fragment-components';

import { getSelectedComponent, updatedState } from '../../components/fragment';

const showComponentCodeOptions = (selectedComponent: any, setComponent: any) => {
	switch (selectedComponent.type) {
		case 'textinput':
			return <ATextInputCodeUI selectedComponent={selectedComponent} setComponent={setComponent} />;

		case 'textarea':
			return <ATextAreaCodeUI selectedComponent={selectedComponent} setComponent={setComponent} />;

		case 'checkbox':
			return <ACheckboxCodeUI selectedComponent={selectedComponent} setComponent={setComponent} />;

		default:
			return <AComponentCodeUI selectedComponent={selectedComponent} setComponent={setComponent} />;
	}
};

export const CodeContextPane = ({fragment, setFragment}: any) => {
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
			{selectedComponent && showComponentCodeOptions(selectedComponent, setComponent)}
		</div>
	);
};
