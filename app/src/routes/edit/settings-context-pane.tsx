import React, { useContext } from 'react';
import {
	Button,
	Checkbox,
	DefinitionTooltip,
	Dropdown,
	NumberInput,
	TextInput
} from '@carbon/react';
import { ChevronDown,ChevronUp } from '@carbon/react/icons';
import { css, cx } from 'emotion';
import Editor from '@monaco-editor/react';
import { capitalize, throttle } from 'lodash';

import {
	ComponentCssClassSelector,
	allComponents,
	LayoutWidget,
	getSelectedComponent,
	updatedState
} from '@carbon-builder/sdk-react';
import { SelectedComponentBreadcrumbs } from './selected-component-breadcrumbs';
import { GlobalStateContext } from '../../context';

const styleContextPaneStyle = css`
.cds--form-item.cds--checkbox-wrapper {
	display: inline-flex;
}`;

export const accordionButtonStyle = css`
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

const showComponentSettingsUI = (selectedComponent: any, setComponent: any, fragment: any, setFragment: any, customComponentsCollections: any[]) => {
	for (const component of Object.values(allComponents)) {
		// Find the UI for editing style for our component
		if (selectedComponent.type === component.componentInfo.type) {
			return <component.componentInfo.settingsUI
				selectedComponent={selectedComponent}
				setComponent={setComponent}
				fragment={fragment}
				setFragment={setFragment} />;
		}
		// Render the UI based on input types
		if (selectedComponent.componentsCollection) {
			// it's a custom component from a collection
			const customComponentsCollection = customComponentsCollections?.find((ccc: any) => ccc.name === selectedComponent.componentsCollection);
			if (customComponentsCollection) {
				const customComponent = customComponentsCollection.components.find((cc: any) => cc.type === selectedComponent.type);

				if (!customComponent?.inputs) {
					return <p>No inputs available.</p>;
				}
				return <>
					{
						Object.entries(customComponent.inputs).map(([input, type]) => {
							// complex types
							if (typeof type === 'object') {
								const t: any = type; // helps avoid casting type to `any` every time

								switch (t.type) {
									default:
										return <>Unsupported type</>;

									case 'multi-select':
										return <Dropdown
											id={input}
											label={capitalize(input)}
											titleText={capitalize(input)}
											items={t.items || []}
											selectedItem={t.items?.find((item: any) => item.id === selectedComponent[input])}
											itemToString={(item: any) => (item ? item.text : '')}
											onChange={(event: any) => setComponent({
												...selectedComponent,
												[input]: event.selectedItem.id
											})} />;
								}
							}

							// simple types
							switch (type) {
								default:
									return <>Unsupported type</>;

								case 'string':
									return <TextInput
										value={selectedComponent[input]}
										labelText={capitalize(input)}
										onChange={(event: any) => setComponent({
											...selectedComponent,
											[input]: event.currentTarget.value
										})} />;

								case 'number':
									return <NumberInput
										id={input}
										value={selectedComponent[input] || 0}
										label={capitalize(input)}
										step={1}
										min={-99999}
										max={99999}
										onChange={(_: any, value: any) => {
											setComponent({
												...selectedComponent,
												[input]: value.value
											});
										}}
									/>;

								case 'boolean':
									return <Checkbox
										labelText={capitalize(input)}
										id={`${input}-checked`}
										checked={selectedComponent[input]}
										onChange={(_: any, { checked }: any) => setComponent({
											...selectedComponent,
											[input]: checked
										})} />;
							}
						})
					}
				</>;
			}
		}
	}
};

let setComponent = (_component: any) => console.log('setComponent not inizialized yet');
const throttledSetComponent = throttle((component: any) => setComponent(component), 150);

let proxySetFragment = (_fragment: any) => console.log('proxySetFragment not inizialized yet');
const throttledSetFragment = throttle((fragment: any) => proxySetFragment(fragment), 150);

export const SettingsContextPane = ({ fragment, setFragment }: any) => {
	const selectedComponent = getSelectedComponent(fragment);
	const {
		settings,
		setSettings,
		styleClasses,
		customComponentsCollections
	} = useContext(GlobalStateContext);

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
						{showComponentSettingsUI(selectedComponent, setComponent, fragment, setFragment, customComponentsCollections)}
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
			{
				selectedComponent && <>
					<Button
					kind='ghost'
					className={accordionButtonStyle}
					renderIcon={settings.contextPane?.settings?.layoutAccordionOpen ? ChevronUp : ChevronDown}
					onClick={() => updateContextPaneSettings({
						layoutAccordionOpen: !settings.contextPane?.settings?.layoutAccordionOpen
					})}>
						Layout
					</Button>
					{
						settings.contextPane?.settings?.layoutAccordionOpen &&
						<div className={accordionContentStyle}>
							{
								selectedComponent && <LayoutWidget component={selectedComponent} setComponent={setComponent} />
							}
						</div>
					}
				</>
			}
			<Button
			kind='ghost'
			className={accordionButtonStyle}
			renderIcon={settings.contextPane?.settings?.advancedStylingAccordionOpen ? ChevronUp : ChevronDown}
			onClick={() => updateContextPaneSettings({
				advancedStylingAccordionOpen: !settings.contextPane?.settings?.advancedStylingAccordionOpen
			})}>
				Advanced styling
			</Button>
			{
				settings.contextPane?.settings?.advancedStylingAccordionOpen &&
				<div className={accordionContentStyle}>
					{
						!selectedComponent
						&& <ComponentCssClassSelector componentObj={fragment} setComponent={setFragment} styleClasses={styleClasses} />
					}
					{
						selectedComponent
						&& <ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} styleClasses={styleClasses} />
					}
				</div>
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
						onChange= {(value: string | undefined, event: any) => {
							if (event?.changes?.some((change: any) => change?.forceMoveMarkers)) {
								// when a user selects a different component from the previously selected
								// the editor seems to clear before the our context reflects it. This
								// calls Editor onChange with an empty value, which in turn clears the
								// value from notes in the state.
								// `forceMoveMarkers` seems to be set to true only when this happens and
								// it allows us to skip updating in that case
								// _there might be a better way to do this_
								return;
							}
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
