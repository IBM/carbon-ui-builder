import React from 'react';
import {
	TextInput,
	Select,
	SelectItem,
	SelectItemGroup,
	Checkbox
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/link.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const ASelectSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>

	</>;
};

export const ASelectCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ASelect = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<Select
			id="select"
			defaultValue={componentObj.defaultValue}
			helperText={componentObj.helperText}
			invalidText={componentObj.invalidText}
			labelText={componentObj.labelText}
			inline={componentObj.inline}
			invalid={componentObj.invalid}
			disabled={componentObj.disabled}>
			{
				componentObj.items.map((step: any, index: any) =>
					step.items && step.items.length > 0
						?
					<SelectItemGroup
					key={index}
					label={step.label}
					disabled={step.disabled}>
					{
						step.items.map((child: any, index: any) => <SelectItem
							text={child.text}
							value={child.value}
							disabled={child.disabled}
							hidden={child.hidden}
							key={index}>
						</SelectItem>)
					}
					</SelectItemGroup>
						:
					<SelectItem
						text={step.text}
						value={step.value}
						disabled={step.disabled}
						hidden={step.hidden}
						key={index}>
					</SelectItem>
				)
			}
			</Select>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASelect,
	settingsUI: ASelectSettingsUI,
	codeUI: ASelectCodeUI,
	render: ({ componentObj, select, remove, selected, renderComponents, outline }) => <ASelect
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
	</ASelect>,
	keywords: ['content', 'switcher'],
	name: 'Select',
	type: 'select',
	defaultComponentObj: {
		type: 'select',
		inline: false,
		invalid: false,
		disabled: false,
		labelText: "Select",
		invalidText: "A valid value is required",
		defaultValue: "placeholder-item",
		helperText: "Optional helper text",
		items: [
			{
				text: 'Choose an option 1',
				value: 'placeholder-item',
				hidden: false,
				disabled: false,
				type: 'select-item'
			},
			{
				text: 'Choose an option 2',
				value: 'placeholder-item',
				hidden: false,
				disabled: false,
				type: 'select-item'
			},
			{
				label: "Category 1",
				disabled: false,
				items: [
					{
						text: "Choose an option 1",
						value: "placeholder-item",
						disabled: false,
						type: 'select-item',
						hidden: false
					},
					{
						text: "Choose an option 2",
						value: "placeholder-item",
						disabled: false,
						type: 'select-item',
						hidden: false
					}
				]
			},
			{
				label: "Category 2",
				disabled: false,
				items: [
					{
						text: "Choose an option 1",
						value: "placeholder-item",
						disabled: false,
						type: 'select-item',
						hidden: false
					}
				]
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
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
