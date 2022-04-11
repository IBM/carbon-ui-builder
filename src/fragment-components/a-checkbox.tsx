import React from 'react';
import { Checkbox, TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/checkbox.svg';
import { angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ACheckboxStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					label: event.currentTarget.value
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>;
};

export const ACheckboxCodeUI = ({ selectedComponent, setComponent }: any) => {
	return (
		<TextInput
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						name: event.currentTarget.value
					}
				});
			}}
		/>
	);
};

export const ACheckbox = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		{...rest}>
			<Checkbox
				kind={componentObj.kind}
				disabled={componentObj.disabled}
				labelText={componentObj.label}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ACheckbox,
	styleUI: ACheckboxStyleUI,
	codeUI: ACheckboxCodeUI,
	keywords: ['checkbox', 'check box'],
	name: 'Checkbox',
	defaultComponentObj: {
		type: 'checkbox',
		label: 'Checkbox'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked: boolean;`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}CheckedChange = new EventEmitter<boolean>();`,
			imports: ['CheckboxModule'],
			code: ({ json }) => {
				return `<ibm-checkbox
					name="${json.codeContext?.name}"
					id="${json.codeContext?.name}"
					[(checked)]="${nameStringToVariableString(json.codeContext?.name)}Checked"
					(checkedChange)="${nameStringToVariableString(json.codeContext?.name)}CheckedChange.emit($event)"
					${angularClassNamesFromComponentObj(json)}>
						${json.label}
				</ibm-checkbox>`;
			}
		},
		react: {
			imports: ['Checkbox'],
			code: ({ json }) => {
				return `<Checkbox
					labelText="${json.label}"
					name="${json.codeContext?.name}"
					id="${json.codeContext?.name}"
					checked={state["${json.codeContext?.name}"]?.checked}
					${reactClassNamesFromComponentObj(json)}
					onChange={(checked) => handleInputChange({
						target: {
							name: "${json.codeContext?.name}",
							value: checked
						}
					})} />`;
			}
		}
	}
};
