import React from 'react';
import { TextInput, Dropdown } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/text-input.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ATextInputSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const typeItems = [
		{ id: 'text', text: 'Text' },
		{ id: 'email', text: 'Email' },
		{ id: 'password', text: 'Password' }
	];

	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	return <>
		<Dropdown
			label='Type'
			titleText='Type'
			items={typeItems}
			selectedItem={typeItems.find(item => item.id === selectedComponent.inputType)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				inputType: event.selectedItem.id
			})} />
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
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size) || sizeItems[1]}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
		})} />
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
		<TextInput
			value={selectedComponent.defaultValue}
			labelText='Default value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					defaultValue: event.currentTarget.value
				});
			}}
		/>
	</>;
};

export const ATextInputCodeUI = ({ selectedComponent, setComponent }: any) => {
	return (
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
	);
};

export const ATextInput = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		rejectDrop={true}
		{...rest}>
			<TextInput
				id={componentObj.id}
				type={componentObj.inputType}
				labelText={componentObj.label}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
				defaultValue={componentObj.defaultValue}
				disabled={componentObj.disabled}
				helperText={componentObj.helperText}
				hideLabel={componentObj.hideLabel}
				inline={componentObj.inline}
				invalid={componentObj.invalid}
				invalidText={componentObj.invalidText}
				light={componentObj.light}
				placeholder={componentObj.placeholder}
				readOnly={componentObj.readOnly}
				size={componentObj.size}
				warn={componentObj.warn}
				warnText={componentObj.warnText} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATextInput,
	settingsUI: ATextInputSettingsUI,
	codeUI: ATextInputCodeUI,
	keywords: ['text', 'text', 'input'],
	name: 'Text input',
	type: 'text-input',
	defaultComponentObj: {
		type: 'text-input',
		label: 'Text input label',
		placeholder: 'Text input placeholder',
		helperText: 'Helper text',
		inputType: 'text'
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
						<input
							ibmText
							${angularClassNamesFromComponentObj(json)}
							name="${json.codeContext?.name}"
							${json.size ? `size="${json.size}"` : ''}
							placeholder="${json.placeholder}">
				</ibm-label>`;
			}
		},
		react: {
			imports: ['TextInput'],
			code: ({ json }) => {
				return `<TextInput
					labelText="${json.label}"
					name="${json.codeContext?.name}"
					helperText="${json.helperText}"
					placeholder="${json.placeholder}"
					${json.size ? `size="${json.size}"` : ''}
					value={state["${json.codeContext?.name}"]}
					${reactClassNamesFromComponentObj(json)}
					onChange={handleInputChange} />`;
			}
		}
	}
};
