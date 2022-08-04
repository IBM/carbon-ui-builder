import React from 'react';
import { Checkbox, Dropdown, Toggle, TextInput } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/toggle.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { css } from 'emotion';
const preventCheckEvent = css`
	pointer-events: none;
`;

export const AToggleSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizes = [
		{ id: 'md', text: 'Medium' },
		{ id: 'sm', text: 'Small' }
	];
	return <>
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizes}
			initialSelectedItem={sizes.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
		})}/>
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}}
		/>
		<Checkbox
			labelText='Checked'
			id='checked'
			checked={selectedComponent.checked}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					checked: checked
				});
			}}
		/>
		<TextInput
			value={selectedComponent.header}
			labelText='Label text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					header: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.onText}
			labelText='On text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					onText: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.offText}
			labelText='Off text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					offText: event.currentTarget.value
				});
			}}
		/>
	</>;
};

export const AToggleCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const AToggle = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Toggle
				size={componentObj.size}
				disabled={componentObj.disabled}
				checked={componentObj.checked}
				id={componentObj.id}
				labelA={componentObj.offText}
				labelB={componentObj.onText}
				labelText={componentObj.header}
				className={` ${preventCheckEvent} ${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} `} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AToggle,
	settingsUI: AToggleSettingsUI,
	codeUI: AToggleCodeUI,
	keywords: ['toggle'],
	name: 'Toggle',
	type: 'toggle',
	defaultComponentObj: {
		type: 'toggle',
		header: 'Toggle',
		offText: 'Off',
		onText: 'On',
		disabled: false,
		checked: false,
		size: 'md'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Header = "${json.header}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}OnText = "${json.onText}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}OffText = "${json.offText}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Size = "${json.size}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${json.checked};`,
			outputs: (_) => '',
			imports: ['ToggleModule'],
			code: ({ json }) => {
				return `<ibm-toggle
					[label]="${nameStringToVariableString(json.codeContext?.name)}Header"
					[onText]="${nameStringToVariableString(json.codeContext?.name)}OnText"
					[offText]="${nameStringToVariableString(json.codeContext?.name)}OffText"
					[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					[checked]="${nameStringToVariableString(json.codeContext?.name)}Checked"
					${angularClassNamesFromComponentObj(json)}>
				</ibm-toggle>`;
			}
		},
		react: {
			imports: ['Toggle'],
			code: ({ json }) => {
				return `<Toggle
					labelText="${json.header}"
					labelA="${json.offText}"
					labelB="${json.onText}"
					${json.disabled ? `disabled="${json.disabled}"` : ''}
					${json.checked ? `toggled="${json.checked}"` : ''}
					size="${json.size}"
					id="${json.id}"
					${reactClassNamesFromComponentObj(json)} />`;
			}
		}
	}
};
