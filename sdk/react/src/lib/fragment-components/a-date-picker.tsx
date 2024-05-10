import React from 'react';
import {
	DatePicker,
	DatePickerInput,
	Dropdown,
	Checkbox,
	TextInput
} from '@carbon/react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/date-picker.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { css, cx } from 'emotion';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

const pickerInputAlignment = css `
	.cds--date-picker {
		display: flex;
		align-items: flex-end;
	}
`;

export const ADatePickerSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const size = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' }
	];

	const datePickerType = [
		{ id: 'simple', text: 'Simple' },
		{ id: 'single', text: 'Single with calender' },
		{ id: 'range', text: 'Range with calender' }
	];

	return <>
		<Dropdown
			label='Date picker type'
			titleText='Date picker type'
			items={datePickerType}
			selectedItem={datePickerType.find(item => item.id === selectedComponent.datePickerType)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				datePickerType: event.selectedItem.id
			})} />
		<TextInput
			value={selectedComponent.dateFormat}
			labelText='Date format'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				dateFormat: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				placeholder: event.currentTarget.value
			})} />
		<Checkbox
			labelText='Light'
			id='light'
			checked={selectedComponent.light}
			onChange={(_: any) => setComponent({
				...selectedComponent,
				light: !selectedComponent.light
			})} />
		<Dropdown
			label='Size'
			titleText='Size'
			items={size}
			selectedItem={size.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
		<Checkbox
			labelText='Disabled'
			id='disable'
			checked={selectedComponent.disabled}
			onChange={(_: any) => setComponent({
				...selectedComponent,
				disabled: !selectedComponent.disabled
			})} />
		<Checkbox
			labelText='Invalid'
			id='invalid'
			checked={selectedComponent.invalid}
			onChange={(_: any) => setComponent({
				...selectedComponent,
				invalid: !selectedComponent.invalid
			})} />
		<TextInput
			value={selectedComponent.rangeStartLabel}
			labelText= {selectedComponent.datePickerType === 'range' ? 'Date picker range start label' : 'Date picker label'}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				rangeStartLabel: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.invalidText}
			labelText= 'Invalid text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				invalidText: event.currentTarget.value
			})} />
		{
			selectedComponent.datePickerType === 'range'
				&& <TextInput
				value={selectedComponent.rangeEndLabel}
				labelText='Date picker range end label'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					rangeEndLabel: event.currentTarget.value
				})} />
		}
	</>;
};

export const ADatePickerCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ADatePicker = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			{
				<DatePicker
					id={componentObj.id}
					className={cx(preventCheckEventStyle, pickerInputAlignment, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
					dateFormat={componentObj.dateFormat}
					datePickerType={componentObj.datePickerType}
					light={componentObj.light}>
						<DatePickerInput
							id={`${componentObj.id} + '-start'`}
							placeholder={componentObj.placeholder}
							disabled={componentObj.disabled}
							invalid={componentObj.invalid}
							invalidText={componentObj.invalidText}
							labelText={componentObj.rangeStartLabel}
							size={componentObj.size} />
						{
							componentObj.datePickerType === 'range' &&
								<DatePickerInput
									id={`${componentObj.id} + '-end'`}
									placeholder={componentObj.placeholder}
									labelText={componentObj.rangeEndLabel}
									size={componentObj.size}
									disabled={componentObj.disabled}
									invalid={componentObj.invalid}
									invalidText={componentObj.invalidText} />
						}
				</DatePicker>
			}
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ADatePicker,
	settingsUI: ADatePickerSettingsUI,
	codeUI: ADatePickerCodeUI,
	keywords: ['datepicker', 'date', 'picker'],
	name: 'Date Picker',
	type: 'date-picker',
	defaultComponentObj: {
		type: 'date-picker',
		placeholder: 'mm/dd/yyyy',
		size: 'md',
		datePickerType: 'simple',
		dateFormat: 'm/d/Y',
		rangeStartLabel: 'Start Label'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value: any = "${json.value ? json.value : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsLight = "${json.light ? json.light : false}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel = "${
						json.rangeStartLabel ? json.rangeStartLabel : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangeEndLabel = "${json.rangeEndLabel ? json.rangeEndLabel : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsDisabled = "${json.disabled ? json.disabled : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsInvalid = "${json.invalid ? json.invalid : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText ? json.invalidText : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder ? json.placeholder : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: any = "${json.size ? json.size : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}DateFormat = "${json.dateFormat ? json.dateFormat : ''}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['DatePickerModule'],
				code: ({ json }) => {
					return `${json.datePickerType === 'simple'
						? `<ibm-date-picker-input
							${angularClassNamesFromComponentObj(json)}
							${json.light ? '[theme]="light"' : ''}
							[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
							[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
							[label]="${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel"
							[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
							[size]="${nameStringToVariableString(json.codeContext?.name)}Size">
						</ibm-date-picker-input>`
						: json.datePickerType === 'single'
						? `<ibm-date-picker
							${angularClassNamesFromComponentObj(json)}
							${json.light ? '[theme]="light"' : ''}
							[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
							[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
							[label]="${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel"
							[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
							[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
							[dateFormat]="${nameStringToVariableString(json.codeContext?.name)}DateFormat"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)">
						</ibm-date-picker>`
						: `<ibm-date-picker
							${angularClassNamesFromComponentObj(json)}
							${json.light ? '[theme]="light"' : ''}
							[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
							[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
							range="true"
							[label]="${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel"
							[rangeLabel]="${nameStringToVariableString(json.codeContext?.name)}RangeEndLabel"
							[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
							[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
							[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
							[dateFormat]="${nameStringToVariableString(json.codeContext?.name)}DateFormat"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)">
						</ibm-date-picker>`
					}`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value: any = "${json.value ? json.value : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsLight = "${json.light ? json.light : false}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel = "${
						json.rangeStartLabel ? json.rangeStartLabel : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangeEndLabel = "${json.rangeEndLabel ? json.rangeEndLabel : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsDisabled = "${json.disabled ? json.disabled : false}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsInvalid = "${json.invalid ? json.invalid : false}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText ? json.invalidText : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder ? json.placeholder : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: any = "${json.size ? json.size : ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}DateFormat = "${json.dateFormat ? json.dateFormat : ''}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['DatePickerModule'],
				code: ({ json }) => {
					return `${json.datePickerType === 'simple'
						? `<ibm-date-picker-input
							${angularClassNamesFromComponentObj(json)}
							${json.light ? '[theme]="light"' : ''}
							[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
							[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
							[label]="${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel"
							[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
							[size]="${nameStringToVariableString(json.codeContext?.name)}Size">
						</ibm-date-picker-input>`
						: json.datePickerType === 'single'
						? `<ibm-date-picker
							${angularClassNamesFromComponentObj(json)}
							${json.light ? '[theme]="light"' : ''}
							[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
							[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
							[label]="${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel"
							[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
							[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
							[dateFormat]="${nameStringToVariableString(json.codeContext?.name)}DateFormat"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)">
						</ibm-date-picker>`
						: `<ibm-date-picker
							${angularClassNamesFromComponentObj(json)}
							${json.light ? '[theme]="light"' : ''}
							[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
							[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
							range="true"
							[label]="${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel"
							[rangeLabel]="${nameStringToVariableString(json.codeContext?.name)}RangeEndLabel"
							[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
							[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
							[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
							[dateFormat]="${nameStringToVariableString(json.codeContext?.name)}DateFormat"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)">
						</ibm-date-picker>`
					}`;
				}
			}
		},
		react: {
			latest: {
				imports: ['DatePicker', 'DatePickerInput'],
				code: ({ json }) => {
					return `<DatePicker
								${reactClassNamesFromComponentObj(json)}
								dateFormat="${json.dateFormat}"
								datePickerType="${json.datePickerType}"
								${json.light ? 'light="true"' : ''}>
								<DatePickerInput
									placeholder="${json.placeholder}"
									${json.rangeStartLabel ? `labelText='${json.rangeStartLabel}'` : ''}
									${json.disabled ? `disabled='${json.disabled}'` : ''}
									${json.invalid ? `invalid='${json.invalid}'` : ''}
									${json.invalidText ? `invalidText='${json.invalidText}'` : ''}
									size="${json.size}"
									type='text'
								/>
								${json.datePickerType === 'range'
									? `<DatePickerInput
										${json.rangeEndLabel ? `labelText='${json.rangeEndLabel}'` : ''}
										${json.disabled ? `disabled='${json.disabled}'` : ''}
										${json.invalid ? `invalid='${json.invalid}'` : ''}
										${json.invalidText ? `invalidText='${json.invalidText}'` : ''}
										placeholder="${json.placeholder}"
										size="${json.size}"
										type='text' />`
									: ''
								}
						</DatePicker>`;
				}
			},
			v10: {
				imports: ['DatePicker', 'DatePickerInput'],
				code: ({ json }) => {
					return `<DatePicker
								${reactClassNamesFromComponentObj(json)}
								dateFormat="${json.dateFormat}"
								datePickerType="${json.datePickerType}"
								${json.light ? 'light="true"' : ''}>
								<DatePickerInput
									placeholder="${json.placeholder}"
									${json.rangeStartLabel ? `labelText='${json.rangeStartLabel}'` : ''}
									${json.disabled ? `disabled='${json.disabled}'` : ''}
									${json.invalid ? `invalid='${json.invalid}'` : ''}
									${json.invalidText ? `invalidText='${json.invalidText}'` : ''}
									size="${json.size}"
									type='text'
								/>
								${json.datePickerType === 'range'
									? `<DatePickerInput
										${json.rangeEndLabel ? `labelText='${json.rangeEndLabel}'` : ''}
										${json.disabled ? `disabled='${json.disabled}'` : ''}
										${json.invalid ? `invalid='${json.invalid}'` : ''}
										${json.invalidText ? `invalidText='${json.invalidText}'` : ''}
										placeholder="${json.placeholder}"
										size="${json.size}"
										type='text' />`
									: ''
								}
						</DatePicker>`;
				}
			}
		}
	}
};
