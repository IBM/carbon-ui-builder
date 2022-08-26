import React from 'react';
import {
	Tab,
	Tabs,
	Checkbox,
	TextInput } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import image from '../../assets/component-icons/link.svg';
import { DraggableTileList } from '../../components/draggable-list';

export const ATabSettingsUI = ({ selectedComponent, setComponent }: any) => {

	const updateListItems = (key: string, value: any, index: number) => {
		const step = {
			...selectedComponent.tabItems[index],
			[key]: value
		};

		setComponent({
			...selectedComponent,
			tabItems: [
				...selectedComponent.tabItems.slice(0, index),
				step,
				...selectedComponent.tabItems.slice(index + 1)
			]
		});
	};

	const template = (item: any, index: number) => {
		return <>
			<TextInput
				light
				value={item.labelText}
				labelText='Tab Label'
				onChange={(event: any) => {
					updateListItems('labelText', event.currentTarget.value, index);
				}}
			/>
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				<Checkbox
					labelText='Disabled'
					id={`disabled-${index}`}
					checked={item.disabled}
					onChange={(checked: boolean) => updateListItems('disabled', checked, index)}/>
			</div>
		</>;
	};
	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			tabItems: newList
		});
	};
	return <>
		<Checkbox
		labelText='Contained'
		id='contained'
		checked={selectedComponent.contained}
		onChange={(checked: boolean) => setComponent({
			...selectedComponent,
			contained: checked
		})} />

		<DraggableTileList
			dataList={[...selectedComponent.tabItems]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				labelText: 'New Tab',
				disabled: false
			}}
			template={template} />
	</>;
};

export const ATabCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
			id="input-name"
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						name: event.currentTarget.value
					}
				});
			}}
		/>;
};

export const ATab = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<Tabs>
				{
					componentObj.tabItems.map((step: any, index: number) => <Tab
					className={step.className}
					label={step.labelText}
					disabled={step.disabled}
					key={index}>
						{children}
					</Tab>)
				}
			</Tabs>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATab,
	settingsUI: ATabSettingsUI,
	codeUI: ATabCodeUI,
	render: ({ componentObj, select, remove, selected, renderComponents, outline }) => <ATab
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.tabPanels.map((button: any) => renderComponents(button, outline))}
	</ATab>,
	keywords: ['tabs', 'tab'],
	name: 'Tabs',
	type: 'tab',
	defaultComponentObj: {
		type: 'tab',
		tabItems: [
			{
				labelText: 'Tab 1',
				disabled: false
			},
			{
				labelText: 'Tab 2',
				disabled: false
			},
			{
				labelText: 'Tab 3',
				disabled: false
			}
		],
		tabPanels: [
			{
				type: 'tab-panel'
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: () => '',
			imports: [''],
			code: () => {
				return '';
			}
		},
		react: {
			imports: ['Link'],
			code: () => {
				return '';
			}
		}
	}
};
