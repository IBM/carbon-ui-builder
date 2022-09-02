import React, { useRef } from 'react';
import {
	Tabs,
	Tab,
	Checkbox,
	TextInput } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import image from '../../assets/component-icons/link.svg';
import { DraggableTileList } from '../../components/draggable-list';
import { APlaceholder } from '../a-placeholder';
import { getDropIndex } from '../../routes/edit/tools';
import { useFragment } from '../../context';
import { getParentComponent, updatedState } from '../../components';
import { template } from 'lodash';

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
	setComponent,
	onDragOver,
	onDrop,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();
	const holderRef = useRef(null as any);

	return (
		<AComponent
		componentObj={componentObj}
		handleDrop={(event: any) => {
			const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));
			const dropIndex = getDropIndex(event, holderRef.current);
			{ // how to push dragObj inside tab items within this fragment
				setFragment({
					...fragment,
					data: updatedState(
						fragment.data.items.find((item: any) => item.type === 'tabs'),
						dragObj,
						componentObj.items[componentObj.selectedTabIndex].id,
						dropIndex
					)
				});
			}
		}}
		{...rest}>
			<Tabs>
				{
					componentObj.items.map((step: any, index: number) => <Tab
						onClick= {() => componentObj.selectedTabIndex = index}
						selected={step.selected}
						onDrop={onDrop}
						onDragOver={onDragOver}
						label={step.labelText}
						disabled={step.disabled}
						className={step.className}
						key={index}>
							<section ref={holderRef}>
								{console.log(children)}
							{

								children && children.length > 0 ? children[index].props.children : <APlaceholder componentObj={step} select={rest.select} />
							}
							</section>
						</Tab>)
				}
			</Tabs>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATabs,
	settingsUI: ATabsSettingsUI,
	codeUI: ATabsCodeUI,
	render: ({ componentObj, select, remove, renderComponents, outline }) => <ATabs
	componentObj={componentObj}
	select={select}
	remove={remove}>
		{componentObj.items.map((tab: any) => renderComponents(tab, outline))}
	</ATabs>,
	keywords: ['tabs', 'tab'],
	name: 'Tabs',
	type: 'tabs',
	defaultComponentObj: {
		type: 'tabs',
		selectedTabIndex: 0,
		items: [
			{
				type: 'tab',
				labelText: 'Tab 1',
				disabled: false,
				items: []
			},
			{
				type: 'tab',
				labelText: 'Tab 2',
				disabled: false,
				items: []
			},
			{
				type: 'tab',
				labelText: 'Tab 3',
				disabled: false,
				items: []
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

