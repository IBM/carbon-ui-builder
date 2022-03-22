import React from 'react';
import { Dropdown, TextInput, RadioButtonGroup} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
// import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';

import image from './../assets/component-icons/radiobutton-group.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';


export const ARadioButtonGroupStyleUI = ({ selectedComponent, setComponent }: any) => {
    const orientationItems = [
		{id: 'horizontal', text: 'Horizontal'},
		{id: 'vertical', text: 'Vertical'},
    ];

    const labelPositions = [
		{id: 'left', text: 'Left'},
		{id: 'right', text: 'Right'},
	];
	return <>
		<TextInput
			value={selectedComponent.legend}
			labelText='Legend name'
			placeholder='Fieldset header'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					legend: event.currentTarget.value,
				});
			}}
		/>
        <Dropdown
			label='Orientation'
			titleText='Orientation'
			items={orientationItems}
			initialSelectedItem={orientationItems.find(item => item.id === selectedComponent.orientation)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				orientation: event.selectedItem.id
		})}/>

        <Dropdown
			label='Label position'
			titleText='Label position'
			items={labelPositions}
			initialSelectedItem={labelPositions.find(item => item.id === selectedComponent.labelPosition)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				labelPosition: event.selectedItem.id
		})}/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ARadioButtonGroupCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			value={selectedComponent.codeContext?.formItemName}
			labelText='Form item name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						formItemName: event.currentTarget.value,
					},
					items: selectedComponent.items.map((button: any) => ({
						...button,
						codeContext: {
							...button.codeContext,
							formItemName: event.currentTarget.value
						}
					}))
				});
			}}
		/>
	</>
};


export const ARadioButtonGroup = ({
	children,
	componentObj,
	selected,
	renderComponents,
	...rest
}: any) => {
	return <>
    <AComponent
		componentObj={componentObj}
		selected={selected}
		{...rest}>
        <fieldset>
            <RadioButtonGroup
                legendText= {componentObj.legend}
                orientation={componentObj.orientation}
                labelPosition={componentObj.labelPosition}
                name={componentObj.codeContext?.formItemName}
                valueSelected={componentObj.defaultSelected}>
                    {children}
            </RadioButtonGroup>
        </fieldset>
    
	</AComponent>
    </>
};

export const componentInfo: ComponentInfo = {
	component: ARadioButtonGroup,
	styleUI: ARadioButtonGroupStyleUI,
	codeUI: ARadioButtonGroupCodeUI,
	keywords: ['radio', 'button', 'group'],
	name: 'Radio button group',
	defaultComponentObj: {
		type: 'radioButtonGroup',
		legend: 'Radio Button Group',
		codeContext: {
			formItemName: 'radio-group'
        },
        labelPosition: 'left',
        orientation: 'horizontal',
		items: [
			{
                type: 'radioButton',
                value: 'button-1',
                id: 'button-1',
				codeContext: {
					formItemName: 'radio-group',
				},
                labelText: "Option 1",
                disabled: false,
                defaultSelected: true
			},
			{
                type: 'radioButton',
                value: 'button-2',
                id: 'button-2',
				codeContext: {
					formItemName: 'radio-group',
                },
                labelText: "Option 2",
                disabled: false
				
			},
			{
                type: 'radioButton',
                value: 'button-3',
                id: 'button-3',
				codeContext: {
					formItemName: 'radio-group'
                },
                labelText: "Option 3",
                disabled: false
			}
		]
	},
	render: ({ componentObj, select, remove, selected, renderComponents }) => <ARadioButtonGroup
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
		{componentObj.items.map((button: any) => (renderComponents(button)))}
	</ARadioButtonGroup>,
	image,
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: ({ json }) =>
				``,
			imports: [''],
			code: ({ json, jsonToTemplate }) => {
				return ``
			}
		},
		react: {
			imports: [''],
			code: ({ json, jsonToTemplate }) => {
				return ``;
			}
		}
	}
};