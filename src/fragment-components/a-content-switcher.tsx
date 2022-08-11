import React from 'react';
import {
	Checkbox,
	TextInput,
	Dropdown,
	ContentSwitcher,
	Switch } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { DraggableTileList } from '../components';
import image from './../assets/component-icons/link.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const AContentSwitcherSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

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
	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};
	const template = (item: any, index: number) => {
		return <>
			<TextInput
				light
				value={item.text}
				labelText='Text'
				onChange={(event: any) => {
					updateListItems('text', event.currentTarget.value, index);
				}}
			/>
			<Checkbox
				labelText='Disabled'
				id={`disabled-${index}`}
				checked={selectedComponent.disabled}
				onChange={(checked: boolean) => {
					updateListItems('disabled', checked, index);
				}}
			/>
		</>;
	};
	return <>
		<Dropdown
			id='content-switcher-size'
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
		})} />
		<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				type: 'switch-item',
				disabled: false,
				name: 'new-option',
				text: 'New option'
			}}
			template={template} />
	</>;
};

export const AContentSwitcherCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
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
		/>
	</>;
};

export const AContentSwitcher = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<ContentSwitcher size={componentObj.size}>
			{
				componentObj.items.map((step: any, index: number) => <Switch
					className={step.className}
					name={step.name}
					text={step.text}
					disabled={step.disabled}
					key={index}
				/>)
			}
			</ContentSwitcher>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AContentSwitcher,
	settingsUI: AContentSwitcherSettingsUI,
	codeUI: AContentSwitcherCodeUI,
	keywords: ['content', 'switcher'],
	name: 'Content Switcher',
	type: 'content-switcher',
	defaultComponentObj: {
		type: 'content-switcher',
		size: 'sm',
		items: [
			{
				name: 'first',
				text: 'First section',
				disabled: false,
				type: 'switch-item',
			},
			{
				name: 'second',
				text: 'Second section',
				disabled: false,
				type: 'switch-item',
			},
			{
				name: 'third',
				text: 'Third section',
				disabled: false,
				type: 'switch-item',
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => ``,
			outputs: ({ json }) => ``,
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		},
		react: {
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		}
	}
};
