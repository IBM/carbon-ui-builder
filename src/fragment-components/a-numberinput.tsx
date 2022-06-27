import React from 'react';
import {
	Checkbox,
	Dropdown,
	TextInput,
	NumberInput
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/number-input.svg';
import { angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ANumberInputSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	return <>
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
		<Checkbox
			labelText='Hide label'
			id='hide-label'
			checked={selectedComponent.hideLabel}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					hideLabel: checked
				});
			}}
		/>
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
		<NumberInput
			value={selectedComponent.min}
			label='Min'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					min: +event.imaginaryTarget.value
				});
			}}
		/>
		<NumberInput
			value={selectedComponent.max}
			label='Max'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					max: +event.imaginaryTarget.value
				});
			}}
		/>
		<NumberInput
			value={selectedComponent.step}
			label='Step'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					step: +event.imaginaryTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.warnText}
			labelText='Warning text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					warnText: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.invalidText}
			labelText='Invalid text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					invalidText: event.currentTarget.value
				});
			}}
		/>
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					light: checked
				});
			}}
		/>
	</>;
};

export const ANumberInputCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const ANumberInput = ({
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
			<NumberInput
				size={componentObj.size}
				helperText={componentObj.helperText}
				warn={componentObj.warn}
				warnText={componentObj.warnText}
				label={componentObj.label}
				hideLabel={componentObj.hideLabel}
				hideSteppers={componentObj.hideSteppers}
				min={componentObj.min}
				max={componentObj.max}
				disabled={componentObj.disabled}
				readOnly={componentObj.readOnly}
				invalid={componentObj.invalid}
				invalidText={componentObj.invalidText}
				light={componentObj.light}
				allowEmpty={componentObj.allowEmpty}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
				type='number' />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ANumberInput,
	settingsUI: ANumberInputSettingsUI,
	codeUI: ANumberInputCodeUI,
	keywords: ['number', 'input'],
	name: 'Number input',
	type: 'number-input',
	defaultComponentObj: {
		type: 'number-input',
		size: 'md',
		label: 'Number input label',
		min: 0,
		max: 100,
		step: 10,
		helperText: 'Helper text'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) =>
				`@Input() ${nameStringToVariableString(json.codeContext?.name)}HelperText = "${json.helperText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = ${Math.round((json.min + json.max) / 2)};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.label}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = "${json.light ? 'light' : ''}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Min = ${json.min};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Max = ${json.max};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Step = ${json.step};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Invalid = ${!!json.invalid};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = ${json.invalidText};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Warn = ${json.warn};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}WarnText = ${json.warnText};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Size = "${json.size}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};`,
			outputs: ({ json }) =>
				`@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter<number>();
				@Output() ${nameStringToVariableString(json.codeContext?.name)}Change = new EventEmitter<any>();`,
			imports: ['NumberModule'],
			code: ({ json }) => {
				return `<ibm-number
					[helperText]="${nameStringToVariableString(json.codeContext?.name)}HelperText"
					name="${json.codeContext?.name}"
					[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
					(change)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value) || numberinput78Change.emit($event)"
					[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
					[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
					[min]="${nameStringToVariableString(json.codeContext?.name)}Min"
					[max]="${nameStringToVariableString(json.codeContext?.name)}Max"
					[step]="${nameStringToVariableString(json.codeContext?.name)}Step"
					[invalid]="${nameStringToVariableString(json.codeContext?.name)}Invalid"
					[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
					[warn]="${nameStringToVariableString(json.codeContext?.name)}Warn"
					[warnText]="${nameStringToVariableString(json.codeContext?.name)}WarnText"
					[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					${angularClassNamesFromComponentObj(json)}>
				</ibm-number>`;
			}
		},
		react: {
			imports: ['NumberInput'],
			code: ({ json }) => {
				return `<NumberInput
					size="${json.size}"
					name="${json.codeContext?.name}"
					helperText="${json.helperText}"
					min="${json.min}"
					max="${json.max}"
					step="${json.step}"
					label="${json.label}"
					${json.warnText !== undefined && json.warnText !== '' ? `warnText="${json.warnText}"` : ''}
					${json.warn !== undefined ? `warn="${json.warn}"` : ''}
					${json.hideLabel !== undefined ? `hideLabel="${json.hideLabel}"` : ''}
					${json.hideSteppers !== undefined ? `hideSteppers="${json.hideSteppers}"` : ''}
					${json.disabled !== undefined ? `disabled="${json.disabled}"` : ''}
					${json.readOnly !== undefined ? `readOnly="${json.readOnly}"` : ''}
					${json.invalid !== undefined ? `invalid="${json.invalid}"` : ''}
					${json.invalidText !== undefined ? `invalidText="${json.invalidText}"` : ''}
					${json.light !== undefined ? `light="${json.light}"` : ''}
					${json.allowEmpty !== undefined ? `allowEmpty="${json.allowEmpty}"` : ''}
					value={state["${json.codeContext?.name}"]}
					${reactClassNamesFromComponentObj(json)}
					onChange={handleInputChange} />`;
			}
		}
	}
};
