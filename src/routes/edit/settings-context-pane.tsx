import React, { useContext } from 'react';
import {
	Button,
	Checkbox,
	DefinitionTooltip
} from '@carbon/react';
import {
	ChevronDown,
	ChevronUp
} from '@carbon/react/icons';
import { css, cx } from 'emotion';
import Editor from '@monaco-editor/react';
import { throttle } from 'lodash';

import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { getSelectedComponent, updatedState } from '../../components/fragment';
import { allComponents } from '../../fragment-components';
import { SelectedComponentBreadcrumbs } from './selected-component-breadcrumbs';
// import { FragmentLayoutWidget } from '../../components/fragment-layout-widget';
import { GlobalStateContext } from '../../context';

const styleContextPaneStyle = css`
.cds--form-item.cds--checkbox-wrapper {
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

	&.cds--btn--ghost .cds--btn__icon {
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

const fullWidthWidgetStyle = css`
	padding-left: 1px;
`;

const tooltipStyle = css`
.cds--tooltip__trigger.cds--tooltip__trigger--definition.cds--tooltip--bottom.cds--tooltip--a11y + .cds--assistive-text {
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

let setComponent = (_component: any) => console.log('setComponent not inizialized yet');
const throttledSetComponent = throttle((component: any) => setComponent(component), 150);

let proxySetFragment = (_component: any) => console.log('proxySetFragment not inizialized yet');
const throttledSetFragment = throttle((component: any) => proxySetFragment(component), 150);

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

	setComponent = (component: any, updateActionHistory = true) => {
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

	proxySetFragment = setFragment;

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
			renderIcon={settings.contextPane?.settings?.generalAccordionOpen ? ChevronUp : ChevronDown}
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
							onChange={(_: any, { checked }: any) => {
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
						<DefinitionTooltip
							definition='Setting a fragment as a template makes it an easy starting point
							for future fragments.'
							direction='bottom'
							className={tooltipStyle}>
							template
						</DefinitionTooltip>
						<Checkbox
							id='setFragmentAsMicroLayout'
							checked={fragment.labels && fragment.labels.includes('micro-layout')}
							labelText='Make this fragment a &nbsp;'
							onChange={(_: any, { checked }: any) => {
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
						<DefinitionTooltip
							definition='Setting a fragment as a micro layout makes it available to drag and drop into fragments'
							direction='bottom'
							className={tooltipStyle}>
							micro layout
						</DefinitionTooltip>
					</>
				}
				</div>
			}
			<Button
			kind='ghost'
			className={accordionButtonStyle}
			renderIcon={settings.contextPane?.settings?.customCSSAccordionOpen ? ChevronUp : ChevronDown }
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
			className={accordionButtonStyle}
			renderIcon={settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen ? ChevronUp : ChevronDown}
			onClick={() => updateContextPaneSettings({
				fragmentLayoutWidgetAccordionOpen: !settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen
			})}>
				Layout
			</Button>
			{
				// Commenting out since we removed fragment layout
				// settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen
				// && <FragmentLayoutWidget fragment={fragment} setFragment={setFragment} />
			}
			<Button
			kind='ghost'
			className={accordionButtonStyle}
			renderIcon={settings.contextPane?.settings?.notesAccordionOpen ? ChevronUp : ChevronDown}
			onClick={() => updateContextPaneSettings({
				notesAccordionOpen: !settings.contextPane?.settings?.notesAccordionOpen
			})}>
				Notes
			</Button>
			{
				settings.contextPane?.settings?.notesAccordionOpen &&
				<div className={fullWidthWidgetStyle}>
					<Editor
						height='300px'
						language='markdown'
						options={{
							minimap: {
								enabled: false
							},
							lineDecorationsWidth: 2,
							lineNumbersMinChars: 4
						}}
						onChange= {(_, value: any) => {
							if (selectedComponent) {
								throttledSetComponent({
									...selectedComponent,
									notes: value
								});
							} else {
								throttledSetFragment({
									...fragment,
									notes: value
								});
							}
						}}
						value={selectedComponent ? selectedComponent.notes : fragment.notes} />
				</div>
			}
		</div>
	);
};
