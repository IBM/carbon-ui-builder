import React from 'react';
import { RadioButton, Dropdown, TextInput } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';

import image from './../assets/component-icons/button.svg';

export const ARadioButtonStyleUI = ({selectedComponent, setComponent}: any) => {
    const orientationItems = [
		{id: 'horizontal', text: 'Horizontal'},
		{id: 'vertical', text: 'Vertical'},
    ];

    const labelPositions = [
		{id: 'left', text: 'Left'},
		{id: 'right', text: 'Right'},
    ];
	return <>

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

        <TextInput
			value={selectedComponent.legend}
			labelText='Legend text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					legend: event.currentTarget.value
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};


export const ARadioButton = ({
	children,
	componentObj,
	onDrop,
	selected,
	renderComponents,
	...rest
}: any) => {
	return (
		<AComponent
        selected={selected}
		componentObj={componentObj}
		{...rest}>


               
                        <RadioButton
                        id="radio-1"
                        labelText="Radio button label"
                        value="standard"
                        className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
                        {...componentObj}
                        {...rest}
                        />
                        
               


		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARadioButton,
	styleUI: ARadioButtonStyleUI,
	render: ({ componentObj, select, remove, selected }) => <ARadioButton
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.text}
	</ARadioButton>,
	keywords: ['radiobutton', 'radio button'],
	name: 'Radio button',
	defaultComponentObj: {
		text: 'Radio button',
        labelPosition: 'left',
        orientation: 'horizontal',
        legend: 'Radio Group'
	
	},
	image,
	codeExport: {
		angular: {
			inputs: ({json}) => ``,
            outputs: ({json}) => ``,
            imports: [''],
			code: ({json }) => {
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