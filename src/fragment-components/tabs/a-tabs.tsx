import React, { useRef } from 'react';
import {
	Tabs,
	Tab,
	Checkbox,
	TextInput } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import image from '../../assets/component-icons/link.svg';
import { DraggableTileList } from '../../components/draggable-list';
import { useFragment } from '../../context';
import { updatedState } from '../../components';
import { APlaceholder } from '../a-placeholder';
import { getDropIndex } from '../../routes/edit/tools';

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
		<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				type: 'tab',
				labelText: 'New tab',
				disabled: false,
				items: []
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
	onDragOver,
	onDrop,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();
	const holderRef = useRef(null as any);
	return (
		<AComponent
		rejectDrop={true}
		componentObj={componentObj}
		{...rest}>
			<Tabs
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{
					componentObj.items.map((step: any, index: number) => <Tab
						className={step.className}
						label={step.labelText}
						disabled={step.disabled}
						key={index}
					>
						{
							<section ref={holderRef} onDrop={(event) => {
								event.stopPropagation();
								event.preventDefault();
								const dropIndex = getDropIndex(event, holderRef.current);
								const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));
								// change the code below to step items array
								setFragment({
									...fragment,
									data: updatedState(
										fragment.data,
										dragObj,
										componentObj.id,
										dropIndex
									)
								});
							}} onDragOver={onDragOver}>
								{
									step.items && step.items.length > 0
									? children
									: <APlaceholder componentObj={step} select={rest.select} />
								}
							</section>
						}
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
	render: ({ componentObj, select, selected, remove, renderComponents, outline }) => <ATabs
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.items.map((tab: any) => {
			if(tab.items && tab.items.length > 0) {
				return tab.items.map((item: any) => { return renderComponents(item, outline)})
			}
		})}
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
				items: []
			},
			{
				type: 'tab',
				labelText: 'Tab 2',
				disabled: false,
				items: [
					{
						type:'text',
						text: 'abc'
					},
					{
						type: 'button',
						kind: 'primary',
						text: 'Button'
					}
				]
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
