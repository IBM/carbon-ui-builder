import React from 'react';
import {
	TextInput,
	Checkbox,
	TooltipDefinition
} from 'carbon-components-react';

import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { getSelectedComponent, updatedState } from '../../components/fragment';
import { allComponents } from '../../fragment-components';
import { SelectedComponentBreadcrumbs } from './selected-component-breadcrumbs';
import { css } from 'emotion';

const styleContextPaneStyle = css`
.bx--form-item.bx--checkbox-wrapper {
	display: inline-flex;
}
`;

const showComponentSettingsUI = (selectedComponent: any, setComponent: any) => {
	for (const component of Object.values(allComponents)) {
		// Find the UI for editing style for our component
		if (selectedComponent.type === component.componentInfo.type) {
			return <component.componentInfo.settingsUI
				selectedComponent={selectedComponent}
				setComponent={setComponent} />;
		}
	}
};

export const SettingsContextPane = ({ fragment, setFragment }: any) => {
	const selectedComponent = getSelectedComponent(fragment);

	const setComponent = (component: any, updateActionHistory = true) => {
		setFragment(
			{
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
		<div className={styleContextPaneStyle}>
			{
				selectedComponent && <>
					<SelectedComponentBreadcrumbs
						fragment={fragment}
						selectedComponent={selectedComponent}
						setFragment={setFragment} />
					<hr />
					<div className='context-pane-content'>
						{showComponentSettingsUI(selectedComponent, setComponent)}
					</div>
				</>
			}
			{
				!selectedComponent && <>
					<TextInput
						id='fragmentName'
						labelText='Fragment name'
						defaultValue={fragment.title}
						onChange={(event: any) => setFragment({
							...fragment,
							title: event.target.value
						})}/>

					<br />

					<Checkbox
						id='setFragmentAsTemplate'
						checked={fragment.labels && fragment.labels.includes('template')}
						labelText='Make this fragment a &nbsp;'
						onChange={(checked: boolean) => {
							if (checked) {
								if(!fragment.labels?.includes('template')) {
									setFragment({
										...fragment,
										labels: [...(fragment.labels || []), 'template']
									});
								}
							} else {
								// if the set template is unchecked, remove the 'template' label
								setFragment({
									...fragment,
									labels: fragment.labels?.filter((label: string) => label !== 'template')
								});
							}
						}}/>
					<TooltipDefinition
						tooltipText='Setting a fragment as a template makes it an easy starting point
						for future fragments.'
						direction='bottom'>
						template
					</TooltipDefinition>
					<Checkbox
						id='setFragmentAsMicroLayout'
						checked={fragment.labels && fragment.labels.includes('micro-layout')}
						labelText='Make this fragment a &nbsp;'
						onChange={(checked: boolean) => {
							if (checked) {
								if(!fragment.labels?.includes('micro-layout')) {
									setFragment({
										...fragment,
										labels: [...(fragment.labels || []), 'micro-layout']
									});
								}
							} else {
								// if the set micro-layout is unchecked, remove the 'micro-layout' label
								setFragment({
									...fragment,
									labels: fragment.labels?.filter((label: string) => label !== 'micro-layout')
								});
							}
						}}/>
					<TooltipDefinition
						tooltipText='Setting a fragment as a micro layout makes it available to drag and drop into fragments'
						direction='bottom'>
						micro layout
					</TooltipDefinition>
				</>
			}
			{
				!selectedComponent && <ComponentCssClassSelector componentObj={fragment} setComponent={setFragment} />
			}
		</div>
	);
};
