import React from 'react';
import { Dropdown, TextInput, } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { css } from 'emotion';
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
	return <AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		selected={selected}
		{...rest}>
		<div
            role="group"
            aria-label="Radio buttons"
			className={`bx--radio-button-group ${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}`}>
			{(componentObj.legend !== undefined && componentObj.legend !== '') &&
				<legend className="bx--label">
					{componentObj.legend}
				</legend>}
			{children}
		</div>
	</AComponent>
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
        defaultSelected:"Button-1",
		items: [
			{
				type: 'radioButton',
				codeContext: {
					value: 'Button-1',
					formItemName: 'radio-group',
				},

				items: [{ type: 'text', text: 'Radio button A' }]
			},
			{
				type: 'radioButton',
				codeContext: {
					value: 'Button-2',
					formItemName: 'radio-group',
				},
				items: [{ type: 'text', text: 'Radio button B' }]
			},
			{
				type: 'radioButton',
				codeContext: {
					value: 'Button-3',
					formItemName: 'radio-group'
				},
				items: [{ type: 'text', text: 'Radio button C' }]
			}
		]
	},
	render: ({ componentObj, select, remove, selected, renderComponents }) => <ARadioButtonGroup
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
		{componentObj.items.map((tile: any) => (renderComponents(tile)))}
	</ARadioButtonGroup>,
	image,
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: ({ json }) =>
				`@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter<Event>();`,
			imports: ['TilesModule'],
			code: ({ json, jsonToTemplate }) => {
				return `<ibm-tile-group
					(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
					[multiple]="false"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ibm-tile-group>`
			}
		},
		react: {
			imports: ['TileGroup'],
			code: ({ json, jsonToTemplate }) => {
				return `<TileGroup
					${json.legend !== undefined && json.legend !== '' ? `legend="${json.legend}"` : ''}
					${json.codeContext?.formItemName !== undefined && json.codeContext?.formItemName !== '' ? `name="${json.codeContext?.formItemName}"` : ''}
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}
					onChange={handleInputChange}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</TileGroup>`;
			}
		}
	}
};