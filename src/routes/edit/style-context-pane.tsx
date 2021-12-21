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

import { SelectedComponentBreadcrumbs } from './selected-component-breadcrumbs';

const showComponentStyleOptions = (selectedComponent: any, setComponent: any, styleClasses: any) => {
	switch (selectedComponent.type) {
		case 'text':
			return <ATextStyleUI selectedComponent={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />

		case 'button':
			return <AButtonStyleUI selectedComponent={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />

		case 'checkbox':
			return <ACheckboxStyleUI selectedComponent={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />

		case 'grid':
			return <AGridStyleUI selectedComponent={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />

		case 'row':
			return <ARowStyleUI selectedComponent={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />

		case 'column':
			return <AColumnStyleUI selectedComponent={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />

		case 'textarea':
			return <ATextAreaStyleUI selectedComponent={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />

		case 'textinput':
			return <ATextInputStyleUI selectedComponent={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />

		default:
			break;
	}
};

export const StyleContextPane = ({fragment, setFragment, styleClasses}: any) => {
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
						{showComponentStyleOptions(selectedComponent, setComponent, styleClasses)}
					</div>
				</>
			}
		</div>
	);
};
