import React from 'react';
import { TextArea, TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/text-area.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ATextAreaSettingsUI = ({ selectedComponent, setComponent }: any) => {
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
		<TextInput
			value={selectedComponent.helperText}
			labelText='Helper text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					helperText: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					placeholder: event.currentTarget.value
				});
			}}
		/>
	</>;
};

export const ATextAreaCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const ATextArea = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent componentObj={componentObj} rejectDrop={true} {...rest}>
			<TextArea
				kind={componentObj.kind}
				disabled={componentObj.disabled}
				labelText={componentObj.label}
				placeholder={componentObj.placeholder}
				helperText={componentObj.helperText}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATextArea,
	settingsUI: ATextAreaSettingsUI,
	codeUI: ATextAreaCodeUI,
	keywords: ['textarea', 'text area', 'input'],
	name: 'Text area',
	type: 'text-area',
	defaultComponentObj: {
		type: 'text-area',
		label: 'Text area label',
		placeholder: 'Text area placeholder',
		helperText: 'Helper text'
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['InputModule'],
			code: ({ json }) => {
				return `<ibm-label
					helperText="${json.helperText}">
						${json.label}
						<textarea
							ibmTextArea
							${angularClassNamesFromComponentObj(json)}
							name="${json.codeContext?.name}"
							placeholder="${json.placeholder}"></textarea>
				</ibm-label>`;
			}
		},
		react: {
			imports: ['TextArea'],
			code: ({ json }) => {
				return `<TextArea
					labelText="${json.label}"
					name="${json.codeContext?.name}"
					helperText="${json.helperText}"
					placeholder="${json.placeholder}"
					value={state["${json.codeContext?.name}"]}
					${reactClassNamesFromComponentObj(json)}
					onChange={handleInputChange} />`;
			}
		}
	}
};
