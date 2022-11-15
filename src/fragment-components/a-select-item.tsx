import React from 'react';
import {
	SelectItem,
	SelectItemGroup,
	TextInput,
	Checkbox
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { css } from 'emotion';
import image from './../assets/component-icons/link.svg';
import {
	nameStringToVariableString,
	angularClassNamesFromComponentObj,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const ASelectItemSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Hidden'
			id='hidden'
			checked={selectedComponent.hidden}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					hidden: checked
				});
			}}/>
		<Checkbox
			labelText='Disable button'
			id='disable'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				disabled: checked
			})}/>
		<TextInput
			value={selectedComponent.text || ''}
			labelText='Select item label'
			placeholder='Select value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					text: event.currentTarget.value
				});
			}}
		/>
	</>;
};

export const ASelectItemCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
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

export const ASelectItem = ({
	componentObj,
	selected,
	...rest
}: any) => {
	const getChildren = (step: any) => {
		if (!step.items) {
			return null;
		}
		return <SelectItem
				text={step.text}
				value={step.value}
				disabled={step.disabled}
				hidden={step.hidden} >
				{
					step.items.length > 0 ? <SelectItemGroup>
						{step.items.map((innerStep: any) => getChildren(innerStep))}
						</SelectItemGroup>
					: []
				}
			</SelectItem>;
	};
	return (
		<AComponent
		selected={selected}
		componentObj={componentObj}
		{...rest}>
			{
				componentObj.items.length > 0
					?
				<SelectItemGroup>
					{componentObj.items.map((step: any) => getChildren(step))}
				</SelectItemGroup>
					:
				<SelectItem
					text={componentObj.text}
					value={componentObj.value}
					disabled={componentObj.disabled}
					hidden={componentObj.hidden} />
			}
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASelectItem,
	settingsUI: ASelectItemSettingsUI,
	codeUI: ASelectItemCodeUI,
	render: ({ componentObj, select, remove, selected }) => <ASelectItem
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
	</ASelectItem>,
	keywords: ['select', 'item'],
	name: 'Select item',
	type: 'select-item',
	defaultComponentObj: {
		type: 'select-item',
		text: "Choose an option",
		value: "placeholder-item",
		disabled: false,
		hidden: false
	},
	image: image,
	hideFromElementsPane: true,
	codeExport: {
		angular: {
			inputs: ({ json }) => ``,
			outputs: ({ json }) => ``,
			imports: [],
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
