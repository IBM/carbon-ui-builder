import React, { useRef } from 'react';
import {
	Tabs,
	Checkbox,
	TextInput } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import image from '../../assets/component-icons/link.svg';
import { DraggableTileList } from '../../components/draggable-list';

export const ATabsSettingsUI = ({ selectedComponent, setComponent }: any) => {

	const updateListItems = (key: string, value: any, index: number) => {
		const step = {
			...selectedComponent.items[index],
			[key]: value
		};

		setComponent({
			...selectedComponent,
			items: [
				...selectedComponent.items.slice(0, index),
				step,
				...selectedComponent.items.slice(index + 1)
			]
		});
	};

	const template = (item: any, index: number) => {
		return <>
			<TextInput
				id='tab-label'
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
			items: newList
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
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				labelText: 'New Tab',
				disabled: false
			}}
			template={template} />
	</>;
};

export const ATabsCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const ATabs = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		rejectDrop={true}
		componentObj={componentObj}
		{...rest}>
			<Tabs>
				{children}
			</Tabs>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATabs,
	settingsUI: ATabsSettingsUI,
	codeUI: ATabsCodeUI,
	render: ({ componentObj, select, remove, selected, renderComponents, outline }) => <ATabs
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.items.map((tab: any) => renderComponents(tab, outline))}
	</ATabs>,
	keywords: ['tabs', 'tab'],
	name: 'Tabs',
	type: 'tabs',
	defaultComponentObj: {
		type: 'tabs',
		items: [
			{
				type: 'tab',
				labelText: 'Tab 1',
				disabled: false,
				tabItems: []
			},
			{
				type: 'tab',
				labelText: 'Tab 2',
				disabled: false,
				tabItems: []
			},
			{
				type: 'tab',
				labelText: 'Tab 3',
				disabled: false,
				tabItems: []
			}
		],
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

