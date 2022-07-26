import React, { useContext } from 'react';
import {
	Button,
	Checkbox,
	TooltipDefinition
} from 'carbon-components-react';
import {
	ChevronDown16,
	ChevronUp16
} from '@carbon/icons-react';

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

const accordionButtonStyle = css`
	display: block;
	color: #161616;
	width: 100%;
	border-top: 1px solid #e0e0e0;

	&:hover {
		color: #161616;
	}

	&.bx--btn--ghost .bx--btn__icon {
		margin-left: 0;
		margin-right: 1rem;
		float: left;
	}
`;

const accordionContentStyle = css`
	padding-left: 1rem;
	padding-right: 1rem;
	margin-bottom: 1rem;
`;

const tooltipStyle = css`
.bx--tooltip__trigger.bx--tooltip__trigger--definition.bx--tooltip--bottom.bx--tooltip--a11y + .bx--assistive-text {
	margin-left: -150px;
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
			<Button
			kind='ghost'
			className={accordionButtonStyle}
			renderIcon={settings.contextPane?.settings?.generalAccordionOpen ? ChevronUp16 : ChevronDown16}
			onClick={() => updateContextPaneSettings({
				generalAccordionOpen: !settings.contextPane?.settings?.generalAccordionOpen
			})}>
				General
			</Button>
			{
				settings.contextPane?.settings?.generalAccordionOpen &&
				<div className={accordionContentStyle}>
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
							direction='bottom'
							className={tooltipStyle}>
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
							direction='bottom'
							className={tooltipStyle}>
							micro layout
						</TooltipDefinition>
					</>
				}
				</div>
			}
			<Button
			kind='ghost'
			className={accordionButtonStyle}
			renderIcon={settings.contextPane?.settings?.customCSSAccordionOpen ? ChevronUp16 : ChevronDown16}
			onClick={() => updateContextPaneSettings({
				customCSSAccordionOpen: !settings.contextPane?.settings?.customCSSAccordionOpen
			})}>
				Custom CSS classes
			</Button>
			{
				settings.contextPane?.settings?.customCSSAccordionOpen &&
				<div className={accordionContentStyle}>
					{
						!selectedComponent && <ComponentCssClassSelector componentObj={fragment} setComponent={setFragment} />
					}
					{
						selectedComponent && <ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
					}
				</div>
			}
			<Button
			kind='ghost'
			className={cx(accordionButtonStyle, 'layout-widget')}
			renderIcon={settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen ? ChevronUp16 : ChevronDown16}
			onClick={() => updateContextPaneSettings({
				fragmentLayoutWidgetAccordionOpen: !settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen
			})}>
				Layout
			</Button>
			{
				settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen &&
					<FragmentLayoutWidget fragment={fragment} setFragment={setFragment} />
			}
		</div>
	);
};
