import React from 'react';
import { Dropdown,
	TextInput,
	RadioButtonGroup,
	Checkbox } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import image from './../assets/component-icons/radiobutton-group.svg';
import { nameStringToVariableString, angularClassNamesFromComponentObj } from '../utils/fragment-tools';


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

		<Checkbox
			labelText='Disable radio group'
			id='disable'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				disabled: checked
			})} />
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
	...rest
}: any) => {
	return (
    <AComponent
		componentObj={componentObj}
		{...rest}>
            <RadioButtonGroup
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
				legendText= {componentObj.legend}
				disabled= {componentObj.disabled}
                orientation={componentObj.orientation}
                labelPosition={componentObj.labelPosition}
                name={componentObj.codeContext?.formItemName}>
                    {children}
            </RadioButtonGroup>
	</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARadioButtonGroup,
	styleUI: ARadioButtonGroupStyleUI,
	codeUI: ARadioButtonGroupCodeUI,
	keywords: ['radio', 'button', 'group'],
	name: 'Radio button group',
	defaultComponentObj: {
		disabled: false,
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
				codeContext: {
					formItemName: 'radio-group',
				},
                labelText: "Option 1",
                disabled: false,
			},
			{
                type: 'radioButton',
				codeContext: {
					formItemName: 'radio-group',
                },
                labelText: "Option 2",
                disabled: false,
				
			},
			{
                type: 'radioButton',
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
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}LegendText = "${json.legend}";
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Orientation = "${json.orientation}";
								@Input() ${nameStringToVariableString(json.codeContext?.name)}LabelPosition = "${json.labelPosition}";`,
			outputs: ({ json }) => ``,
			imports: ['RadioModule'],
			code: ({ json, jsonToTemplate }) => {
				return `
				<legend class="bx--label">{{${nameStringToVariableString(json.codeContext?.name)}LegendText}}</legend>
				<ibm-radio-group
					[orientation]="${nameStringToVariableString(json.codeContext?.name)}Orientation"
					[labelPlacement]="${nameStringToVariableString(json.codeContext?.name)}LabelPosition"
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ibm-radio-group>`
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
