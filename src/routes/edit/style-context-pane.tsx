import React from 'react';

import { getSelectedComponent, updatedState } from '../../components/fragment';

import {
	AButtonStyleUI,
	ACheckboxStyleUI,
	AGridStyleUI,
	ATextStyleUI,
	ATextAreaStyleUI,
	ATextInputStyleUI,
	ARowStyleUI,
	AColumnStyleUI
} from '../../fragment-components';
import { ASearchInputStyleUI } from '../../fragment-components/a-searchinput';

import { SelectedComponentBreadcrumbs } from './selected-component-breadcrumbs';

const showComponentStyleOptions = (selectedComponent: any, setComponent: any) => {
	switch (selectedComponent.type) {
		case 'text':
			return <ATextStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		case 'button':
			return <AButtonStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		case 'checkbox':
			return <ACheckboxStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		case 'grid':
			return <AGridStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		case 'row':
			return <ARowStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		case 'column':
			return <AColumnStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		case 'textarea':
			return <ATextAreaStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		case 'textinput':
			return <ATextInputStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		case 'search':
			return <ASearchInputStyleUI selectedComponent={selectedComponent} setComponent={setComponent} />

		default:
			break;
	}
};

export const StyleContextPane = ({fragment, setFragment}: any) => {
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
