import React from 'react';
import { TextArea, TextInput } from '@carbon/react';
import { AComponent } from './a-component';
import { ComponentInfo } from '.';
import { css, cx } from 'emotion';
import image from './../assets/component-icons/text-area.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../tools';
import { styleObjectToString } from '@carbon-builder/ui-fragment';
import { preventClickStyle } from '../styles';

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

export const ATextAreaCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	labelText='Input name'
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			codeContext: {
				name: event.currentTarget.value
			}
		});
	}} />;

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
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`,
					preventClickStyle
				)} />
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
			latest: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['InputModule'],
				code: ({ json }) => {
					return `<cds-textarea-label
						helperText="${json.helperText}">
							${json.label}
							<textarea
								ibmTextArea
								${angularClassNamesFromComponentObj(json)}
								name="${json.codeContext?.name}"
								placeholder="${json.placeholder}"></textarea>
					</cds-textarea-label>`;
				}
			},
			v10: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['InputModule'],
				code: ({ json }) => {
					return `<ibm-textarea-label
						helperText="${json.helperText}">
							${json.label}
							<textarea
								ibmTextArea
								${angularClassNamesFromComponentObj(json)}
								name="${json.codeContext?.name}"
								placeholder="${json.placeholder}"></textarea>
					</ibm-textarea-label>`;
				}
			}
		},
		react: {
			latest: {
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
			},
			v10: {
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
	}
};
