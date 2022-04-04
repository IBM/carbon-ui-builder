import React from 'react';
import { RadioButton, TextInput, Checkbox } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { useFragment } from '../context';
import { css } from 'emotion';
import { getParentComponent, updatedState, Adder } from '../components';
import image from './../assets/component-icons/radiobutton.svg';
import { nameStringToVariableString,
		angularClassNamesFromComponentObj,
		reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ARadioButtonStyleUI = ({selectedComponent, setComponent}: any) => {
	return <>
		<Checkbox
			labelText='Disable button'
			id='disable'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				disabled: checked
			})}/>
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
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent}/>
	</>
};

const addButtonCss = css`
	position: relative;
`;

export const ARadioButton = ({
	children,
	componentObj,
	selected,
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
					value: `${componentObj.id}`,
					codeContext: {
						formItemName: componentObj.codeContext?.formItemName
					},
					labelText: 'New Option',
					disabled: false
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});
	componentObj.value = `${componentObj.id}`;
	return	(
		<Adder
			active={selected}
			addButtonsCss={addButtonCss}
			key={componentObj.id}
			bottomAction={() => addRadio(1)}>
			<AComponent
				selected={selected}
				headingCss={css`width: fit-content; min-width: 9rem;`}
				componentObj={componentObj}
				{...rest}> 
					<RadioButton
						id={componentObj.id}
						name={componentObj.codeContext?.formItemName}
						labelText={componentObj.labelText}
						defaultChecked={componentObj.defaultChecked}
						checked={componentObj.defaultChecked}
						value= {componentObj.value}
						disabled= {componentObj.disabled}/>
			</AComponent>
		</Adder>
	)
};

export const componentInfo: ComponentInfo = {
	component: ARadioButton,
	styleUI: ARadioButtonStyleUI,
	render: ({ componentObj, select, remove, selected }) => <ARadioButton
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.labelText}
	</ARadioButton>,
	keywords: ['radio','button'],
	name: 'Radio button',
	defaultComponentObj: {
		type: 'radioButton'
	},
	image: image,
	hideFromElementsPane: true,
	codeExport: {
		angular: {
			inputs: ({json}) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.labelText}";
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Id = "${json.codeContext?.name}";
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.value}";
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${json.defaultChecked};`,
            outputs: ({json}) => ``,
            imports: ['RadioModule'],
			code: ({json }) => {
				return `<ibm-radio
					[id]="${nameStringToVariableString(json.codeContext?.name)}Id"
					[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
					[checked]="${nameStringToVariableString(json.codeContext?.name)}Checked"
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					${angularClassNamesFromComponentObj(json)}>
					{{${nameStringToVariableString(json.codeContext?.name)}Label}}
				</ibm-radio>`;
			}
		},
		react: {
			imports: ['RadioButton'],
			code: ({ json }) => {
				return `<RadioButton
					id="${json.codeContext?.name}"
					value="${json.value}"
					checked="${json.defaultChecked}"
					labelText="${json.labelText}"
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}/>`
			}
		}
	}
};
