import React, { useContext } from 'react';
import {
	Accordion,
	AccordionItem,
	Checkbox,
	TooltipDefinition
} from 'carbon-components-react';

import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { getSelectedComponent, updatedState } from '../../components/fragment';
import { allComponents } from '../../fragment-components';
import { SelectedComponentBreadcrumbs } from './selected-component-breadcrumbs';
import { css, cx } from 'emotion';
import { FragmentLayoutWidget } from '../../components/fragment-layout-widget';
import { GlobalStateContext } from '../../context';

const styleContextPaneStyle = css`
.bx--form-item.bx--checkbox-wrapper {
	display: inline-flex;
}`;

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
	const { settings, setSettings } = useContext(GlobalStateContext);

	const updateContextPaneSettings = (s: any) => {
		setSettings({
			...settings,
			contextPane: {
				...(settings.contextPane || {}),
				settings: {
					...(settings.contextPane?.settings || {}),
					...s
				}
			}
		});
	};

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
		<div className={cx(styleContextPaneStyle, 'context-pane-content')}>
			{
				selectedComponent &&
					<SelectedComponentBreadcrumbs
						fragment={fragment}
						selectedComponent={selectedComponent}
						setFragment={setFragment} />
			}
			<Accordion align='start'>
				<AccordionItem
				title='General'
				open={settings.contextPane?.settings?.generalAccordionOpen}
				onHeadingClick={() => updateContextPaneSettings({
					generalAccordionOpen: !settings.contextPane?.settings?.generalAccordionOpen
				})}>
					{
						selectedComponent && <>
							{showComponentSettingsUI(selectedComponent, setComponent)}
						</>
					}
					{
						!selectedComponent && <>
							<Checkbox
								id='setFragmentAsTemplate'
								checked={fragment.labels && fragment.labels.includes('template')}
								labelText='Make this fragment a &nbsp;'
								onChange={(checked: boolean) => {
									if (checked) {
										if (!fragment.labels?.includes('template')) {
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
										if (!fragment.labels?.includes('micro-layout')) {
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
				</AccordionItem>
				<AccordionItem
				title='Custom CSS classes'
				open={settings.contextPane?.settings?.customCSSAccordionOpen}
				onHeadingClick={() => updateContextPaneSettings({
					customCSSAccordionOpen: !settings.contextPane?.settings?.customCSSAccordionOpen
				})}>
					{
						!selectedComponent && <ComponentCssClassSelector componentObj={fragment} setComponent={setFragment} />
					}
					{
						selectedComponent && <ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
					}
				</AccordionItem>
				<AccordionItem
				title='Layout'
				className='layout-widget'
				open={settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen}
				onHeadingClick={() => updateContextPaneSettings({
					fragmentLayoutWidgetAccordionOpen: !settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen
				})}>
					<FragmentLayoutWidget fragment={fragment} setFragment={setFragment} />
				</AccordionItem>
			</Accordion>
		</div>
	);
};
