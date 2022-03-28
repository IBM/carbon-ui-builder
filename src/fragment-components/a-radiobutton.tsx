import React, { useEffect } from 'react';
import { RadioButton, TextInput, Checkbox } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { useFragment } from '../context';
import { Add32 } from '@carbon/icons-react';
import { css, cx } from 'emotion';
import { getParentComponent, updatedState } from '../components';


export const ARadioButtonStyleUI = ({selectedComponent, setComponent}: any) => {
	return <>
		<Checkbox
			labelText='Disable button'
			id='disable'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				disabled: checked
			})} />
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};


export const ARadioButtonCodeUI = ({ selectedComponent, setComponent }: any) => {
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
			value={selectedComponent.id || ''}
			labelText='Radio button ID'
			placeholder='Custom ID'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					id: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.labelText || ''}
			labelText='Radio button label'
			placeholder='Button value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					labelText: event.currentTarget.value
				});
			}}
		/>
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
	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addRadio = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'radioButton',
					codeContext: {
						formItemName: componentObj.codeContext?.formItemName
					},
					labelText: componentObj.labelText,
					disabled: componentObj.disabled
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});
	return <>
		
		<AComponent
			className = ""
			selected={selected}
			headingCss={css`width: fit-content; min-width: 9rem;`}
			componentObj={componentObj}
			{...rest}> 
				<RadioButton
					id={componentObj.codeContext?.name}
					name={componentObj.codeContext?.formItemName}
					labelText={componentObj.labelText}
					value={componentObj.value}
					disabled= {componentObj.disabled}/>
		</AComponent>

	
	</>
};

export const componentInfo: ComponentInfo = {
	component: ARadioButton,
	styleUI: ARadioButtonStyleUI,
	codeUI: ARadioButtonCodeUI,
	keywords: ['radiobutton', 'radio button'],
	name: 'Radio button',
	defaultComponentObj: {
		type: 'radioButton',
		items: []
	},
	
	image: undefined,
	hideFromElementsPane: true,
	render: ({ componentObj, select, remove, selected, renderComponents }) => <ARadioButton
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.labelText}
	</ARadioButton>,
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
