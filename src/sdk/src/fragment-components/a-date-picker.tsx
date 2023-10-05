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
} from '../tools';
import { css, cx } from 'emotion';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

const pickerInputAlignment = css `
	.cds--date-picker {
		display: flex;
		align-items: flex-end !important;
	}
`;

export const ADatePickerSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const size = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'xl', text: 'Extra large' }
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
					className={cx(preventCheckEventStyle, pickerInputAlignment, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
					dateFormat={componentObj.dateFormat}
					datePickerType={componentObj.datePickerType}
					light={componentObj.light}>
						<DatePickerInput
							placeholder={componentObj.placeholder}
							disabled={componentObj.disabled}
							invalid={componentObj.invalid}
							invalidText={componentObj.invalidText}
							labelText={componentObj.rangeStartLabel}
							size={componentObj.size} />
						{
							componentObj.datePickerType === 'range' &&
								<DatePickerInput
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
		dateFormat: 'm/d/Y'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.value ? json.value : ''}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['DatePickerModule'],
				code: ({ json }) => {
					return `${json.datePickerType === 'simple'
						? `<ibm-date-picker-input
							${angularClassNamesFromComponentObj(json)}
							${json.light ? '[light]="true"' : ''}
							${json.rangeStartLabel ? `[label]='${json.rangeStartLabel}'` : ''}
							${json.disabled ? `[disabled]='${json.disabled}'` : ''}
							${json.invalid ? `[invalid]='${json.invalid}'` : ''}
							${json.invalidText ? `[invalidText]='${json.invalidText}'` : ''}
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
							[value]="'${nameStringToVariableString(json.codeContext?.name)}Value'"
							[placeholder]="'${json.placeholder}'"
							[size]="${json.size}">
						</ibm-date-picker-input>`
						: json.datePickerType === 'single'
						? `<ibm-date-picker
							${angularClassNamesFromComponentObj(json)}
							${json.rangeStartLabel ? `[label]='${json.rangeStartLabel}'` : ''}
							${json.light ? '[light]="true"' : ''}
							${json.disabled ? `[disabled]='${json.disabled}'` : ''}
							${json.invalid ? `[invalid]='${json.invalid}'` : ''}
							${json.invalidText ? `[invalidText]='${json.invalidText}'` : ''}
							[placeholder]="'${json.placeholder}'"
							[size]="${json.size}"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							[dateFormat]="${json.dateFormat}"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)">
						</ibm-date-picker>`
						: `<ibm-date-picker
							${angularClassNamesFromComponentObj(json)}
							${json.rangeStartLabel ? `[label]='${json.rangeStartLabel}'` : ''}
							${json.rangeEndLabel ? `[rangeLabel]='${json.rangeEndLabel}'` : ''}
							${json.light ? '[light]="true"' : ''}
							${json.disabled ? `[disabled]='${json.disabled}'` : ''}
							${json.invalid ? `[invalid]='${json.invalid}'` : ''}
							${json.invalidText ? `[invalidText]='${json.invalidText}'` : ''}
							[size]="${json.size}"
							range="true"
							[placeholder]="'${json.placeholder}'"
							[dateFormat]="${json.dateFormat}"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)">
						</ibm-date-picker>`
					}`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.value ? json.value : ''}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['DatePickerModule'],
				code: ({ json }) => {
					return `${json.datePickerType === 'simple'
						? `<ibm-date-picker-input
							${angularClassNamesFromComponentObj(json)}
							${json.light ? '[light]="true"' : ''}
							${json.rangeStartLabel ? `[label]='${json.rangeStartLabel}'` : ''}
							${json.disabled ? `[disabled]='${json.disabled}'` : ''}
							${json.invalid ? `[invalid]='${json.invalid}'` : ''}
							${json.invalidText ? `[invalidText]='${json.invalidText}'` : ''}
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
							[value]="'${nameStringToVariableString(json.codeContext?.name)}Value'"
							[placeholder]="'${json.placeholder}'"
							[size]="${json.size}">
						</ibm-date-picker-input>`
						: json.datePickerType === 'single'
						? `<ibm-date-picker
							${angularClassNamesFromComponentObj(json)}
							${json.rangeStartLabel ? `[label]='${json.rangeStartLabel}'` : ''}
							${json.light ? '[light]="true"' : ''}
							${json.disabled ? `[disabled]='${json.disabled}'` : ''}
							${json.invalid ? `[invalid]='${json.invalid}'` : ''}
							${json.invalidText ? `[invalidText]='${json.invalidText}'` : ''}
							[placeholder]="'${json.placeholder}'"
							[size]="${json.size}"
							[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
							[dateFormat]="${json.dateFormat}"
							(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)">
						</ibm-date-picker>`
						: `<ibm-date-picker
							${angularClassNamesFromComponentObj(json)}
							${json.rangeStartLabel ? `[label]='${json.rangeStartLabel}'` : ''}
							${json.rangeEndLabel ? `[rangeLabel]='${json.rangeEndLabel}'` : ''}
							${json.light ? '[light]="true"' : ''}
							${json.disabled ? `[disabled]='${json.disabled}'` : ''}
							${json.invalid ? `[invalid]='${json.invalid}'` : ''}
							${json.invalidText ? `[invalidText]='${json.invalidText}'` : ''}
							[size]="${json.size}"
							range="true"
							[placeholder]="'${json.placeholder}'"
							[dateFormat]="${json.dateFormat}"
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
