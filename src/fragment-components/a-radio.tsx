import React from 'react';
import {
	RadioButton,
	TextInput,
	Checkbox
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { useFragment } from '../context';
import { css } from 'emotion';
import {
	getParentComponent,
	updatedState,
	Adder
} from '../components';
import image from './../assets/component-icons/radio.svg';
import {
	nameStringToVariableString,
	angularClassNamesFromComponentObj,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const ARadioStyleUI = ({ selectedComponent, setComponent }: any) => {
	const [fragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, selectedComponent);
	return <>
		<Checkbox
			labelText='Default selected'
			id='defaultSelected'
			checked={selectedComponent.defaultChecked}
			onChange={() => {
				setComponent({
					...parentComponent,
					defaultSelected: selectedComponent.id,
					valueChecked: selectedComponent.id,
					items: parentComponent.items.map((item: any) => ({
						...item,
						defaultChecked: selectedComponent.id === item.id
					}))
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
	</>;
};

const addButtonStyle = css`
	position: relative;
`;

export const ARadio = ({
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
					type: 'radio',
					value: componentObj.id,
					labelText: 'New option',
					defaultChecked: false,
					disabled: false
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});
	return (
		<Adder
		active={selected}
		addButtonsCss={addButtonStyle}
		key={componentObj.id}
		leftAction= {() => addRadio(0)}
		bottomAction={() => addRadio(1)}>
			<AComponent
			selected={selected}
			headingCss={css`width: fit-content; min-width: 9rem;`}
			componentObj={componentObj}
			{...rest}>
				<RadioButton
					id={componentObj.id}
					name={componentObj.codeContext?.name}
					labelText={componentObj.labelText}
					defaultChecked={componentObj.defaultChecked}
					checked={componentObj.defaultChecked}
					value={componentObj.value}
					disabled= {componentObj.disabled} />
			</AComponent>
		</Adder>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARadio,
	styleUI: ARadioStyleUI,
	render: ({ componentObj, select, remove, selected }) => <ARadio
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.labelText}
	</ARadio>,
	keywords: ['radio', 'button'],
	name: 'Radio button',
	defaultComponentObj: {
		type: 'radio'
	},
	image: image,
	hideFromElementsPane: true,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.labelText}";
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Id = "${json.codeContext?.name}";
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.id}";
								@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${json.defaultChecked};`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
			imports: [],
			code: ({ json }) => {
				return `<ibm-radio
					[id]="${nameStringToVariableString(json.codeContext?.name)}Id"
					[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
					[checked]="${nameStringToVariableString(json.codeContext?.name)}Checked"
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					(change)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
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
					value="${json.id}"
					checked={${json.defaultChecked}}
					labelText="${json.labelText}"
					onChange={(radio) => handleInputChange({
						target: {
							name: "${json.codeContext?.name}",
							value: radio
						}
					})}
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}/>`;
			}
		}
	}
};
