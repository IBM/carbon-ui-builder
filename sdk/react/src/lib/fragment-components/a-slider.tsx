import React from 'react';
import {
	Slider,
	TextInput,
	NumberInput,
	Checkbox
} from '@carbon/react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/slider.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

export const ASliderSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Disabled'
			id='disable-label'
			checked={selectedComponent.disabled}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				disabled: checked
			})} />

		<Checkbox
			labelText='Hide text input'
			id='hide-text-input'
			checked={selectedComponent.textInputHidden}
			onChange={(_: any, { checked }: any)=> setComponent({
				...selectedComponent,
				textInputHidden: checked
			})} />

		<Checkbox
			labelText='Light'
			id='light'
			checked={selectedComponent.light}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				light: checked
			})} />

		<TextInput
			id='slider-label'
			value={selectedComponent.labelText}
			labelText='Slider label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				labelText: event.currentTarget.value
			})} />

		<NumberInput
			id='slider-min'
			value={selectedComponent.min}
			label='Min'
			onChange={(_: any, { value }: any) => {
				setComponent({
					...selectedComponent,
					min: value
				});
			}} />

		<NumberInput
			id='slider-max'
			value={selectedComponent.max}
			label='Max'
			onChange={(_: any, { value }: any) => setComponent({
				...selectedComponent,
				max: value
			})} />

		<NumberInput
			id='slider-value'
			value={selectedComponent.value}
			label='Value'
			onChange={(_: any, { value }: any) => setComponent({
				...selectedComponent,
				value: value
			})} />

		<NumberInput
			id='slider-step'
			value={selectedComponent.step}
			label='Step'
			onChange={(_: any, { value }: any) => setComponent({
				...selectedComponent,
				step: value
			})} />

		<NumberInput
			id='step-multiplier'
			value={selectedComponent.stepMultiplier}
			label='Step multiplier'
			onChange={(_: any, { value }: any) => setComponent({
				...selectedComponent,
				stepMultiplier: value
			})} />

		<TextInput
			id='min-label'
			value={selectedComponent.minLabel}
			labelText='Min label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				minLabel: event.currentTarget.value
			})} />

		<TextInput
			id='max-label'
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
	onChange={(event: any) => setComponent({
		...selectedComponent,
		codeContext: {
			...selectedComponent.codeContext,
			name: event.currentTarget.value
		}
	})}
/>;

export const ASlider = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Slider
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				id={componentObj.id}
				labelText={componentObj.labelText}
				min={componentObj.min}
				max={componentObj.max}
				value={componentObj.value}
				disabled={componentObj.disabled}
				step={componentObj.step}
				hideTextInput={componentObj.textInputHidden}
				stepMultiplier={componentObj.stepMultiplier}
				minLabel={componentObj.minLabel}
				maxLabel={componentObj.maxLabel}
				light={componentObj.light} />
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
		selected={selected} />,
	keywords: ['slider', 'number', 'range', 'input'],
	name: 'Slider',
	type: 'slider',
	defaultComponentObj: {
		type: 'slider',
		labelText: 'Slider label',
		min: 0,
		max: 100
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.labelText}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = ${json.value ?? 0};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Min = ${json.min};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Max = ${json.max};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}MinLabel = "${json.minLabel ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}MaxLabel = "${json.maxLabel ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Step = ${json.step ?? 1};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}StepMultiplier = ${json.stepMultiplier ?? 1};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = "${json.light ? 'light' : 'dark'}"; `,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['SliderModule'],
				code: ({ json }) => {
					return `<cds-slider
						${angularClassNamesFromComponentObj(json)}
						[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
						[min]="${nameStringToVariableString(json.codeContext?.name)}Min"
						[max]="${nameStringToVariableString(json.codeContext?.name)}Max"
						[step]="${nameStringToVariableString(json.codeContext?.name)}Step"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[shiftMultiplier]="${nameStringToVariableString(json.codeContext?.name)}StepMultiplier"
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
						(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event)">
						<span minLabel>{{${nameStringToVariableString(json.codeContext?.name)}MinLabel}}</span>
						<span maxLabel>{{${nameStringToVariableString(json.codeContext?.name)}MaxLabel}}</span>
						<input [ngClass]="{'cds--text-input--light': ${nameStringToVariableString(json.codeContext?.name)}Theme === 'light'}"/>
					</cds-slider>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.labelText}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = ${json.value ?? 0};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Min = ${json.min};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Max = ${json.max};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}MinLabel = "${json.minLabel ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}MaxLabel = "${json.maxLabel ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Step = ${json.step ?? 1};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}StepMultiplier = ${json.stepMultiplier ?? 1};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = "${json.light ? 'light' : 'dark'}"; `,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['SliderModule'],
				code: ({ json }) => {
					return `<ibm-slider
						${angularClassNamesFromComponentObj(json)}
						[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
						[min]="${nameStringToVariableString(json.codeContext?.name)}Min"
						[max]="${nameStringToVariableString(json.codeContext?.name)}Max"
						[step]="${nameStringToVariableString(json.codeContext?.name)}Step"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[shiftMultiplier]="${nameStringToVariableString(json.codeContext?.name)}StepMultiplier"
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
						(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event)">
						<span minLabel>{{${nameStringToVariableString(json.codeContext?.name)}MinLabel}}</span>
						<span maxLabel>{{${nameStringToVariableString(json.codeContext?.name)}MaxLabel}}</span>
						<input [ngClass]="{'cds--text-input--light': ${nameStringToVariableString(json.codeContext?.name)}Theme === 'light'}"/>
					</ibm-slider>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['Slider'],
				code: ({ json }) => {
					return `<Slider
						labelText='${json.labelText}'
						min={${json.min}}
						max={${json.max}}
						${json.value ? `value={${json.value}}` : ''}
						${json.step ? `step={${json.step}}` : ''}
						${json.stepMultiplier ? `stepMultiplier={${json.stepMultiplier}}` : ''}
						${json.disabled ? `disabled={${json.disabled}}` : ''}
						${json.textInputHidden ? `hideTextInput={${json.textInputHidden}}` : ''}
						${json.minLabel ? `minLabel="${json.minLabel}"` : ''}
						${json.maxLabel ? `maxLabel="${json.maxLabel}"` : ''}
						${json.light ? `light={${json.light}}` : ''}
						onChange={({value}) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value
							}
						})}
						${reactClassNamesFromComponentObj(json)} />`;
				}
			},
			v10: {
				imports: ['Slider'],
				code: ({ json }) => {
					return `<Slider
						labelText='${json.labelText}'
						min={${json.min}}
						max={${json.max}}
						${json.value ? `value={${json.value}}` : ''}
						${json.step ? `step={${json.step}}` : ''}
						${json.stepMultiplier ? `stepMultiplier={${json.stepMultiplier}}` : ''}
						${json.disabled ? `disabled={${json.disabled}}` : ''}
						${json.textInputHidden ? `hideTextInput={${json.textInputHidden}}` : ''}
						${json.minLabel ? `minLabel="${json.minLabel}"` : ''}
						${json.maxLabel ? `maxLabel="${json.maxLabel}"` : ''}
						${json.light ? `light={${json.light}}` : ''}
						onChange={({value}) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value
							}
						})}
						${reactClassNamesFromComponentObj(json)} />`;
				}
			}
		}
	}
};
