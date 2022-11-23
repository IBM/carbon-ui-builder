import React from 'react';
import {
	Slider,
	TextInput,
	Checkbox
} from 'carbon-components-react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/slider.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

export const ASliderSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Disabled'
			id='disable-label'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}} />

		<Checkbox
			labelText='Hide text input'
			id='hide-text-input'
			checked={selectedComponent.hideTextInput}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					hideTextInput: checked
				});
			}} />

		<Checkbox
			labelText='Light'
			id='light'
			checked={selectedComponent.light}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					light: checked
				});
			}} />

		<TextInput
			value={selectedComponent.labelText}
			labelText='Slider label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				labelText: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.min}
			labelText='Min'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				min: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.max}
			labelText='Max'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				max: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.value}
			labelText='Value'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				value: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.step}
			labelText='Step'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				step: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.stepMultiplier}
			labelText='Step multiplier'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				stepMultiplier: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.minLabel}
			labelText='Min label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				minLabel: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.maxLabel}
			labelText='Max label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				maxLabel: event.currentTarget.value
			})} />
	</>;
};

export const ASliderCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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
/>;

export const ASlider = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Slider
			id="slider"
			labelText={componentObj.labelText}
			min={componentObj.min}
			max={componentObj.max}
			value={componentObj.value}
			disabled={componentObj.disabled}
			step={componentObj.step}
			hideTextInput={componentObj.hideTextInput}
			stepMultiplier={componentObj.stepMultiplier}
			minLabel={componentObj.minLabel}
			maxLabel={componentObj.maxLabel}
			light={componentObj.light}
			className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}>
				{children}
			</Slider>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASlider,
	settingsUI: ASliderSettingsUI,
	codeUI: ASliderCodeUI,
	render: ({ componentObj, select, remove, selected }) => <ASlider
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
	</ASlider>,
	keywords: ['slider'],
	name: 'Slider',
	type: 'slider',
	defaultComponentObj: {
		type: 'slider',
		labelText: 'Slider label',
		min: 0,
		max: 100,
		value: 0,
		disabled: false,
		hideTextInput: false,
		light: false,
		step: 1,
		stepMultiplier: 4,
		minLabel: '',
		maxLabel: ''
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.labelText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = ${json.value};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Min = ${json.min};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Max = ${json.max};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}MinLabel = "${json.minLabel}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}MaxLabel = "${json.maxLabel}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Step = ${json.step};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}StepMultiplier = ${json.stepMultiplier};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}HideTextInput = ${json.hideTextInput};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Light = "${json.light ? 'light' : 'dark'}" `,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
			imports: ['SliderModule'],
			otherImports: () => 'import { CommonModule } from \'@angular/common\'',
			code: ({ json }) => {
				return `<ibm-slider
					[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
					[min]="${nameStringToVariableString(json.codeContext?.name)}Min"
					[max]="${nameStringToVariableString(json.codeContext?.name)}Max"
					[step]="${nameStringToVariableString(json.codeContext?.name)}Step"
					[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
					[shiftMultiplier]="${nameStringToVariableString(json.codeContext?.name)}StepMultiplier"
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)">
					<span minLabel>{{${nameStringToVariableString(json.codeContext?.name)}MinLabel}}</span>
					<span maxLabel>{{${nameStringToVariableString(json.codeContext?.name)}MaxLabel}}</span>
					<input [ngClass]="{'bx--text-input--light':  ${nameStringToVariableString(json.codeContext?.name)}Light === 'light'}"
					${angularClassNamesFromComponentObj(json)} />
				</ibm-slider>`;
			}
		},
		react: {
			imports: ['Slider'],
			code: ({ json }) => {
				return `<Slider
					labelText="${json.labelText}"
					min={${json.min}}
					max={${json.max}}
					value={${json.value}}
					step={${json.step}}
					stepMultiplier={${json.stepMultiplier}}
					${json.disabled ? `disabled={${json.disabled}}` : ''}
					${json.hideTextInput ? `hideTextInput={${json.hideTextInput}}` : ''}
					${json.minLabel ? `minLabel="${json.minLabel}"` : ''}
					${json.maxLabel ? `maxLabel="${json.maxLabel}"` : ''}
					${json.light ? `light={${json.light}}` : ''}
					onChange={handleInputChange}
					${reactClassNamesFromComponentObj(json)}>
				</Slider>`;
			}
		}
	}
};
