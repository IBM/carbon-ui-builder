import React from 'react';
import {
	TextInput,
	Select,
	SelectItemGroup
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { DraggableTileList } from '../components';
import image from './../assets/component-icons/link.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { css, cx } from 'emotion';


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
			defaultValue={componentObj.defaultValue}
			helperText={componentObj.helperText}
			id="select-1"
			invalidText={componentObj.invalidText}
			labelText={componentObj.labelText}
			inline={componentObj.inline}
			invalid={componentObj.invalid}
			disabled={componentObj.disabled}>
				{children}
			</Select>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASelect,
	settingsUI: ASelectSettingsUI,
	codeUI: ASelectCodeUI,
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
					},
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
