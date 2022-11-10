import React from 'react';
import {
	Checkbox,
	TextInput,
	Dropdown,
	ContentSwitcher,
	Switch
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { DraggableTileList } from '../components';
import image from './../assets/component-icons/content-switcher.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { css, cx } from 'emotion';

const preventCheckEvent = css`
	pointer-events: none;
`;

export const AContentSwitcherSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	const selectedItems = selectedComponent.items.map((step: any, index: number) => ({ id: index, text: step.text }));

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
				}} />
			<Checkbox
				labelText='Disabled'
				id={`disabled-${index}`}
				checked={selectedComponent.disabled}
				onChange={(checked: boolean) => {
					updateListItems('disabled', checked, index);
				}} />
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
		<Dropdown
			id='selected-item'
			label='Selected content'
			titleText='Selected content'
			items={selectedItems}
			selectedItem={selectedItems.find((item: any) => item.id === selectedComponent.selectedIndex)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				selectedIndex: event.selectedItem.id
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

export const AContentSwitcherCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const AContentSwitcher = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<ContentSwitcher
			size={componentObj.size}
			selectedIndex={componentObj.selectedIndex}
			className={cx(preventCheckEvent, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}>
			{
				componentObj.items.map((step: any, index: number) => <Switch
					className={step.className}
					name={step.name}
					text={step.text}
					disabled={step.disabled}
					key={index} />
				)
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
	name: 'Content switcher',
	type: 'content-switcher',
	defaultComponentObj: {
		type: 'content-switcher',
		size: 'sm',
		selectedIndex: 0,
		items: [
			{
				name: 'first',
				text: 'First section',
				disabled: false,
				type: 'switch-item'
			},
			{
				name: 'second',
				text: 'Second section',
				disabled: false,
				type: 'switch-item'
			},
			{
				name: 'third',
				text: 'Third section',
				disabled: false,
				type: 'switch-item'
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter();`,
			imports: ['ContentSwitcherModule'],
			code: ({ json }) => {
				// add size input once https://github.com/carbon-design-system/carbon-components-angular/issues/2322 closes
				// https://github.com/IBM/carbon-ui-builder/issues/187
				return `<ibm-content-switcher
					${angularClassNamesFromComponentObj(json)}
					(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit()">
					${json.items.map((step: any, index: number) => `<button
							${json.selectedIndex === index ? `active="${json.selectedIndex === index}"` : ''}
							ibmContentOption
							name="${step.name}"
							[disabled]="${step.disabled}">
							${step.text}
						</button>`
					).join('\n')}
				</ibm-content-switcher>`;
			}
		},
		react: {
			imports: ['ContentSwitcher', 'Switch'],
			code: ({ json }) => {
				return `<ContentSwitcher
					size="${json.size}"
					selectedIndex={${json.selectedIndex}}
					${reactClassNamesFromComponentObj(json)}
					onChange={(selectedItem) => handleInputChange({
						target: {
							name: "${nameStringToVariableString(json.codeContext?.name)}",
							value: selectedItem
						}
					})}>
					${json.items.map((step: any) => `<Switch
						name="${step.name}"
						text="${step.text}"
						disabled={${step.disabled}}/>`
					).join('\n')}
				</ContentSwitcher>`;
			}
		}
	}
};
