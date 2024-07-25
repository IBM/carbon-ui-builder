import React, { useState } from 'react';
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

const checkboxStyle = css`
	padding-top: 0.5rem;
`;

export const ADatePickerSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const [showRangePlaceholder, setShowRangePlaceholder] = useState(false);
	const [rangePlaceholder, setRangePlaceholder] = useState('Range placeholder');

	const size = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	const datePickerType = [
		{ id: 'simple', text: 'Simple' },
		{ id: 'single', text: 'Single with calender' },
		{ id: 'range', text: 'Range with calender' }
	];

	return <>
		<Checkbox
			labelText='Light'
			id='light'
			checked={selectedComponent.light}
			onChange={(_: any) => setComponent({
				...selectedComponent,
				light: !selectedComponent.light
			})} />
		<Checkbox
			labelText='Disabled'
			id='disable'
			checked={selectedComponent.disabled}
			onChange={(_: any) => setComponent({
				...selectedComponent,
				disabled: !selectedComponent.disabled
			})} />
		<Dropdown
			id='datepicker-variation'
			label='Date picker type'
			titleText='Date picker type'
			items={datePickerType}
			selectedItem={datePickerType.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				kind: event.selectedItem.id,
				rangeEndLabel: event.selectedItem.id === 'range' ? 'Range end' : undefined
			})} />
		{
			(selectedComponent.kind === 'single' || selectedComponent.kind === 'range') &&
			<TextInput
				id='date-format'
				value={selectedComponent.dateFormat}
				labelText='Date format'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					dateFormat: event.currentTarget.value
				})} />
		}
		<TextInput
			id='placeholder'
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				placeholder: event.currentTarget.value
			})} />
		{selectedComponent.kind === 'range' &&
			<Checkbox
				className={checkboxStyle}
				labelText='Override range placeholder'
				id='override-range-placeholder'
				checked={showRangePlaceholder}
				onChange={(_: any, { checked }: any) => {
					setShowRangePlaceholder(checked);
					setComponent({
						...selectedComponent,
						rangePlaceholder: checked ? rangePlaceholder : undefined
					});
				}} />
		}
		{
			showRangePlaceholder
			&& <TextInput
				id='range-placeholder'
				value={selectedComponent.rangePlaceholder}
				labelText='Range placeholder'
				onChange={(event: any) => {
					setRangePlaceholder(event.currentTarget.value);
					setComponent({
						...selectedComponent,
						rangePlaceholder: event.currentTarget.value
					});
				}} />
		}
		<Dropdown
			id='size-select'
			label='Size'
			titleText='Size'
			items={size}
			selectedItem={size.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
		<TextInput
			id='range-start-label'
			value={selectedComponent.rangeStartLabel}
			labelText={selectedComponent.kind === 'range' ? 'Date picker range start label' : 'Date picker label'}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				rangeStartLabel: event.currentTarget.value
			})} />
		{
			selectedComponent.kind === 'range'
			&& <TextInput
				id='range-end-label'
				value={selectedComponent.rangeEndLabel}
				labelText='Date picker range end label'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					rangeEndLabel: event.currentTarget.value
				})} />
		}
		<Checkbox
			className={checkboxStyle}
			labelText='Invalid'
			id='invalid'
			checked={selectedComponent.invalid}
			onChange={(_: any) => setComponent({
				...selectedComponent,
				invalid: !selectedComponent.invalid
			})} />
		<TextInput
			id='invalid-text'
			value={selectedComponent.invalidText}
			labelText='Invalid text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				invalidText: event.currentTarget.value
			})} />
		{
			selectedComponent.kind === 'range'
			&& <TextInput
				id='range-invalid-text'
				value={selectedComponent.rangeInvalidText}
				labelText='Date picker range invalid text'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					rangeInvalidText: event.currentTarget.value
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
					className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
					dateFormat={componentObj.dateFormat}
					datePickerType={componentObj.kind}
					light={componentObj.light}>
					<DatePickerInput
						id={componentObj.id}
						placeholder={componentObj.placeholder}
						disabled={componentObj.disabled}
						invalid={componentObj.invalid}
						invalidText={componentObj.invalidText}
						labelText={componentObj.rangeStartLabel}
						size={componentObj.size} />
					{
						componentObj.kind === 'range'
						&& <DatePickerInput
							id={`${componentObj.id}-end`}
							placeholder={componentObj.rangePlaceholder || componentObj.placeholder}
							labelText={componentObj.rangeEndLabel}
							size={componentObj.size}
							disabled={componentObj.disabled}
							invalid={componentObj.invalid}
							invalidText={componentObj.rangeInvalidText} />
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
		rangeStartLabel: 'Label'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value: (string | Date)[]
					= ${json.value ? json.value : "['']"};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme: "light" | "dark" = "${json.light ? 'light' : 'dark'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel = "${json.rangeStartLabel}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangeEndLabel = "${json.rangeEndLabel ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsDisabled = ${!!json.disabled};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsInvalid = ${!!json.invalid};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder ?? 'mm/dd/yyyy'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangePlaceholder = "${json.rangePlaceholder ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: "sm" | "md" | "lg" = "${json.size || 'md'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}DateFormat = "${json.dateFormat || 'm/d/Y'}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['DatePickerModule'],
				code: ({ json }) => {
					return `<cds-date-picker
						${angularClassNamesFromComponentObj(json)}
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
						[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
						[label]="${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel"
						[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
						(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event)"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
						[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
						${
							!json.kind || json.kind === 'simple'
								? `[dateFormat]="${nameStringToVariableString(json.codeContext?.name)}DateFormat"`
								: `[range]="true" [rangeLabel]="${nameStringToVariableString(json.codeContext?.name)}RangeEndLabel"`
						}>
						</cds-date-picker>
					`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value: (string | Date)[]
					= ${json.value ? json.value : "['']"};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme: "light" | "dark" = "${json.light ? 'light' : 'dark'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel = "${json.rangeStartLabel}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangeEndLabel = "${json.rangeEndLabel ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsDisabled = ${!!json.disabled};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsInvalid = ${!!json.invalid};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder ?? 'mm/dd/yyyy'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}RangePlaceholder = "${json.rangePlaceholder ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: "sm" | "md" | "lg" = "${json.size || 'md'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}DateFormat = "${json.dateFormat || 'm/d/Y'}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['DatePickerModule'],
				code: ({ json }) => {
					return `<cds-date-picker
						${angularClassNamesFromComponentObj(json)}
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
						[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
						[label]="${nameStringToVariableString(json.codeContext?.name)}RangeStartLabel"
						[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
						(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event)"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
						[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
						${
							!json.kind || json.kind === 'simple'
								? `[dateFormat]="${nameStringToVariableString(json.codeContext?.name)}DateFormat"`
								: `[range]="true" [rangeLabel]="${nameStringToVariableString(json.codeContext?.name)}RangeEndLabel"`
						}>
						</cds-date-picker>
					`;
				}
			}
		},
		react: {
			latest: {
				imports: ['DatePicker', 'DatePickerInput'],
				code: ({ json }) => {
					return `<DatePicker
					${reactClassNamesFromComponentObj(json)}
					${json.kind ? `datePickerType="${json.kind}"` : ''}
					${json.dateFormat ? `dateFormat="${json.dateFormat}"` : ''}
					${json.light ? 'light={true}' : ''}
					${json.kind !== 'simple' ? `onChange={(dates) => handleInputChange({
						target: {
							name: "${json.codeContext?.name}",
							value: dates
						}
					})}`: ''}>
					<DatePickerInput
						id="${nameStringToVariableString(json.codeContext?.name)}"
						${json.placeholder ? `placeholder='${json.placeholder}'` : ''}
						${json.rangeStartLabel ? `labelText='${json.rangeStartLabel}'` : ''}
						${json.disabled ? `disabled={${json.disabled}}` : ''}
						${json.invalid ? `invalid={${json.invalid}}` : ''}
						${json.invalidText ? `invalidText='${json.invalidText}'` : ''}
						${json.size && json.size !== 'md' ? `size="${json.size}"` : ''}
						${
							json.kind === 'simple'
								? `onChange={(dates) => handleInputChange({
									target: {
										name: "${json.codeContext?.name}",
										value: dates
									}})}`
								: ''
						}
					/>
					${
						json.kind === 'range'
							? `<DatePickerInput
								id="${nameStringToVariableString(json.codeContext?.name) + '-end'}"
								${json.rangePlaceholder ? `placeholder="${json.rangePlaceholder}"` : `placeholder="${json.placeholder}"`}
								${json.rangeEndLabel ? `labelText='${json.rangeEndLabel}'` : ''}
								${json.disabled ? `disabled={${json.disabled}}` : ''}
								${json.invalid ? `invalid={${json.invalid}}` : ''}
								${json.invalidText ? `invalidText='${json.rangeInvalidText}'` : ''}
								${json.size && json.size !== 'md' ? `size="${json.size}"` : ''} />`
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
					${json.kind ? `datePickerType="${json.kind}"` : ''}
					${json.dateFormat ? `dateFormat="${json.dateFormat}"` : ''}
					${json.light ? 'light={true}' : ''}
					${json.kind !== 'simple' ? `onChange={(dates) => handleInputChange({
						target: {
							name: "${json.codeContext?.name}",
							value: dates
						}
					})}`: ''}>
					<DatePickerInput
						id="${nameStringToVariableString(json.codeContext?.name)}"
						${json.placeholder ? `placeholder='${json.placeholder}'` : ''}
						${json.rangeStartLabel ? `labelText='${json.rangeStartLabel}'` : ''}
						${json.disabled ? `disabled={${json.disabled}}` : ''}
						${json.invalid ? `invalid={${json.invalid}}` : ''}
						${json.invalidText ? `invalidText='${json.invalidText}'` : ''}
						${json.size && json.size !== 'md' ? `size="${json.size}"` : ''}
						${
							json.kind === 'simple'
								? `onChange={(dates) => handleInputChange({
									target: {
										name: "${json.codeContext?.name}",
										value: dates
									}})}`
								: ''
						}
					/>
					${
						json.kind === 'range'
							? `<DatePickerInput
								id="${nameStringToVariableString(json.codeContext?.name) + '-end'}"
								${json.rangePlaceholder ? `placeholder="${json.rangePlaceholder}"` : `placeholder="${json.placeholder}"`}
								${json.rangeEndLabel ? `labelText='${json.rangeEndLabel}'` : ''}
								${json.disabled ? `disabled={${json.disabled}}` : ''}
								${json.invalid ? `invalid={${json.invalid}}` : ''}
								${json.invalidText ? `invalidText='${json.rangeInvalidText}'` : ''}
								${json.size && json.size !== 'md' ? `size="${json.size}"` : ''} />`
							: ''
					}
					</DatePicker>`;
				}
			}
		}
	}
};
