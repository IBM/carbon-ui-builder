import React from 'react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/time-picker.svg';
import { TextInput, Checkbox, Dropdown, TimePicker, TimePickerSelect, SelectItem } from '@carbon/react';
import { DraggableTileList, angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../helpers';
import { css, cx } from 'emotion';
import { styleObjectToString } from '@carbon-builder/player-react';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

export const ATimePickerSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const size = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	const updateListItems = (key: string, value: any, index: number) => {
		const step = {
			...selectedComponent.timezones[index],
			[key]: value
		};
		setComponent({
			...selectedComponent,
			timezones: [
				...selectedComponent.timezones.slice(0, index),
				step,
				...selectedComponent.timezones.slice(index + 1)
			]
		});
	};

	const template = (item: any, index: number) => {
		return <>
			<TextInput
				light
				value={item.text}
				labelText='Text label'
				onChange={(event: any) => {
					updateListItems('text', event.currentTarget.value, index);
				}} />
			<TextInput
				light
				value={item.value}
				labelText='Value'
				onChange={(event: any) => {
					updateListItems('value', event.currentTarget.value, index);
				}} />
			<Checkbox
				id={`timezone-selected-${index}`}
				labelText='Selected'
				checked={item.selected}
				onChange={(_: any, { checked }: any) => {
					updateListItems('selected', checked, index);
				}} />
		</>;
	};

	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			timezones: newList
		});
	};
	return <>
		<Checkbox
			labelText='AM/PM'
			id='amPm'
			checked={selectedComponent.isShowTimePeriod}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isShowTimePeriod: checked
		})} />
		<Checkbox
			labelText='Light'
			id='light'
			checked={selectedComponent.light}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				light: checked
		})} />
		<Checkbox
			labelText='Disabled'
			id='disable'
			checked={selectedComponent.disabled}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				disabled: checked
		})} />
		<Checkbox
			labelText='Hide label'
			id='hide-label'
			checked={selectedComponent.hideLabel}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				hideLabel: checked
		})} />
		<Checkbox
			labelText='Invalid'
			id='invalid'
			checked={selectedComponent.invalid}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				invalid: checked
		})} />
		<Dropdown
			id='size'
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
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				label: event.currentTarget.value
		})} />
		<TextInput
			value={selectedComponent.invalidText}
			labelText='Invalid text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				invalidText: event.currentTarget.value
		})} />
		<TextInput
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				placeholder: event.currentTarget.value
		})} />
		<DraggableTileList
			dataList={[...selectedComponent.timezones]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				text: 'New timezone',
				value: 'Time Zone 1',
				selected: false
			}}
			template={template} />
	</>;
};

export const ATimePickerCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ATimePicker = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			{
				<TimePicker
				className={cx(
					preventCheckEventStyle,
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`
				)}
				disabled={componentObj.disabled}
				invalid={componentObj.invalid}
				invalidText={componentObj.invalidText}
				placeholder={componentObj.placeholder}
				hideLabel={componentObj.hideLabel}
				labelText={componentObj.label}
				light={componentObj.light}
				size={componentObj.size}>
					{componentObj.isShowTimePeriod &&
						<TimePickerSelect disabled={componentObj.disabled} id={componentObj.codeContext?.name + '-select-1'}>
							{
								componentObj.timePeriod.map((step: any, index: number) => <SelectItem
									value={step.value}
									text={step.text}
									key={index}
									selected={step.selected} />
								)
							}
						</TimePickerSelect>
					}
					{componentObj.timezones.length > 0 &&
						<TimePickerSelect disabled={componentObj.disabled} id={componentObj.codeContext?.name + '-select-2'}>
							{
								componentObj.timezones.map((step: any, index: number) => <SelectItem
									value={step.value}
									text={step.text}
									key={index}
									selected={step.selected} />
								)
							}
						</TimePickerSelect>
					}
				</TimePicker>
			}
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATimePicker,
	settingsUI: ATimePickerSettingsUI,
	codeUI: ATimePickerCodeUI,
	keywords: ['timepicker', 'time', 'picker'],
	name: 'Time Picker',
	type: 'time-picker',
	defaultComponentObj: {
		type: 'time-picker',
		invalidText: 'A valid value is required',
		placeholder: 'hh:mm',
		label: 'Select a time',
		isShowTimePeriod: false,
		timePeriod: [
			{
				value:'AM',
				text:'AM',
				selected: true
			},
			{
				value:'PM',
				text:'PM',
				selected: false
			}
		],
		value: '',
		timezones: []
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.value}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.label}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme: "light" | "dark" = "${json.light ? 'light' : 'dark'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsInvalid = ${json.invalid ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: "sm" | "md" | "lg" = "${json.size ?? 'md'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}HideLabel = ${json.hideLabel ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsDisabled = ${json.disabled ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsShowTimePeriod = ${json.isShowTimePeriod ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}TimePeriod: {value: string; text: string; selected: boolean}[]
					= ${JSON.stringify(json.timePeriod)};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Timezones: {value: string; text: string; selected: boolean}[]
					= ${JSON.stringify(json.timezones)}`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter<any>();
					@Output() ${nameStringToVariableString(json.codeContext?.name)}TimeperiodChange = new EventEmitter<any>();
					@Output() ${nameStringToVariableString(json.codeContext?.name)}TimezoneChange = new EventEmitter<any>();`,
				imports: ['TimePickerModule', 'TimePickerSelectModule'],
				code: ({ json }) => {
					return `<cds-timepicker
						${angularClassNamesFromComponentObj(json)}
						[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
						[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
						[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
						[hideLabel]="${nameStringToVariableString(json.codeContext?.name)}HideLabel"
						[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
						(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event)"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled">
							<cds-timepicker-select
								*ngIf="${nameStringToVariableString(json.codeContext?.name)}IsShowTimePeriod"
								[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
								[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
								(change)="${nameStringToVariableString(json.codeContext?.name)}TimeperiodChange.emit($event)">
								<option
									*ngFor="let step of ${nameStringToVariableString(json.codeContext?.name)}TimePeriod"
									[value]="step.value"
									[selected]="step.selected">
									{{step.text}}
								</option>
							</cds-timepicker-select>
							<cds-timepicker-select
								*ngIf="${nameStringToVariableString(json.codeContext?.name)}Timezones.length"
								[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
								[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
								(change)="${nameStringToVariableString(json.codeContext?.name)}TimezoneChange.emit($event)">
								<option
									*ngFor="let step of ${nameStringToVariableString(json.codeContext?.name)}Timezones"
									[value]="step.value"
									[selected]="step.selected">
									{{step.text}}
								</option>
							</cds-timepicker-select>
                        </cds-timepicker>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.value}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.label}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme: "light" | "dark" = "${json.light ? 'light' : 'dark'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsInvalid = ${json.invalid ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: "sm" | "md" | "lg" = "${json.size ?? 'md'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}HideLabel = ${json.hideLabel ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsDisabled = ${json.disabled ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}IsShowTimePeriod = ${json.isShowTimePeriod ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}TimePeriod: {value: string; text: string; selected: boolean}[]
					= ${JSON.stringify(json.timePeriod)};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Timezones: {value: string; text: string; selected: boolean}[]
					= ${JSON.stringify(json.timezones)}`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter<any>();
					@Output() ${nameStringToVariableString(json.codeContext?.name)}TimeperiodChange = new EventEmitter<any>();
					@Output() ${nameStringToVariableString(json.codeContext?.name)}TimezoneChange = new EventEmitter<any>();`,
				imports: ['TimePickerModule', 'TimePickerSelectModule'],
				code: ({ json }) => {
					return `<ibm-timepicker
						${angularClassNamesFromComponentObj(json)}
						[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						[invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
						[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
						[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
						[hideLabel]="${nameStringToVariableString(json.codeContext?.name)}HideLabel"
						[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
						(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[disabled]="${json.disabled}">
							<ibm-timepicker-select
								*ngIf="${nameStringToVariableString(json.codeContext?.name)}IsShowTimePeriod"
								[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
								[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
								(change)="${nameStringToVariableString(json.codeContext?.name)}TimeperiodChange.emit($event)">>
								<option
									*ngFor="let step of ${nameStringToVariableString(json.codeContext?.name)}TimePeriod"
									[value]="step.value"
									[selected]="step.selected">
									{{step.text}}
								</option>
							</ibm-timepicker-select>
							<ibm-timepicker-select
								[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
								[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
								(change)="${nameStringToVariableString(json.codeContext?.name)}TimezoneChange.emit($event)">
								<option
									*ngFor="let step of ${nameStringToVariableString(json.codeContext?.name)}Timezones"
									[value]="step.value"
									[selected]="step.selected">
									{{step.text}}
								</option>
							</ibm-timepicker-select>
						</ibm-timepicker>`;
				}
			}
		},
		react: {
			latest: {
				imports: ({ json }) => ['TimePicker',
					...((json.timePeriod && json.isShowTimePeriod) || json.timezones.length ? ['TimePickerSelect', 'SelectItem'] : [])],
				code: ({ json }) => {
					return `<TimePicker
						${reactClassNamesFromComponentObj(json)}
						${json.disabled ? `disabled={${json.disabled}}` : ''}
						labelText="${json.label}"
						${json.size ? `size="${json.size}"` : ''}
						${json.invalid ? `invalid={${json.invalid}}` : ''}
						invalidText="${json.invalidText}"
						placeholder="${json.placeholder}"
						${json.hideLabel ? `hideLabel={${json.hideLabel}}` : ''}
						${json.light ? `light={${json.light}}` : ''}
						name="${json.codeContext?.name}"
						onChange={(event) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: event.target.value
							}
						})}>
							${(json.timePeriod && json.isShowTimePeriod) ?
								`<TimePickerSelect
									id="${json.codeContext?.name + '-select-1'}"
									name="${json.codeContext?.name}TimeZone"
									onChange={(event) => handleInputChange({
										target: {
											name: "${json.codeContext?.name}TimeZone",
											value: event.target.value
										}
									})}>
									${json.timePeriod.map((step: any) => (`<SelectItem
										value="${step.value}"
										text="${step.text}"
										${step.selected ? 'selected={true}' : ''} />`
									)).join('\n')}
								</TimePickerSelect>` : ''
							}
							${json.timezones.length ?
								`<TimePickerSelect
									id="${json.codeContext?.name + '-select-2'}"
									name="${json.codeContext?.name}TimeZone"
									onChange={(event) => handleInputChange({
										target: {
											name: "${json.codeContext?.name}TimeZone",
											value: event.target.value
										}
									})}>
									${json.timezones.map((step: any) => (`<SelectItem
										value="${step.value}"
										text="${step.text}"
										${step.selected ? 'selected={true}' : ''} />`
									)).join('\n')}
								</TimePickerSelect>` : ''
							}
					</TimePicker>`;
				}
			},
			v10: {
				imports: ({ json }) => ['TimePicker',
					...((json.timePeriod && json.isShowTimePeriod) || json.timezones.length ? ['TimePickerSelect', 'SelectItem'] : [])],
				code: ({ json }) => {
					return `<TimePicker
						${reactClassNamesFromComponentObj(json)}
						${json.disabled ? `disabled={${json.disabled}}` : ''}
						labelText="${json.label}"
						${json.size ? `size="${json.size}"` : ''}
						${json.invalid ? `invalid={${json.invalid}}` : ''}
						invalidText="${json.invalidText}"
						placeholder="${json.placeholder}"
						${json.hideLabel ? `hideLabel={${json.hideLabel}}` : ''}
						${json.light ? `light={${json.light}}` : ''}
						name="${json.codeContext?.name}"
						onChange={(event) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: event.target.value
							}
						})}>
							${(json.timePeriod && json.isShowTimePeriod) ?
								`<TimePickerSelect
									id="${json.codeContext?.name + '-select-1'}"
									name="${json.codeContext?.name}TimeZone"
									onChange={(event) => handleInputChange({
										target: {
											name: "${json.codeContext?.name}TimeZone",
											value: event.target.value
										}
									})}>
									${json.timePeriod.map((step: any) => (`<SelectItem
										value="${step.value}"
										text="${step.text}"
										${step.selected ? 'selected={true}' : ''} />`
									)).join('\n')}
								</TimePickerSelect>` : ''
							}
							${json.timezones.length ?
								`<TimePickerSelect
									id="${json.codeContext?.name + '-select-2'}"
									name="${json.codeContext?.name}TimeZone"
									onChange={(event) => handleInputChange({
										target: {
											name: "${json.codeContext?.name}TimeZone",
											value: event.target.value
										}
									})}>
									${json.timezones.map((step: any) => (`<SelectItem
										value="${step.value}"
										text="${step.text}"
										${step.selected ? 'selected={true}' : ''} />`
									)).join('\n')}
								</TimePickerSelect>` : ''
							}
					</TimePicker>`;
				}
			}
		}
	}
};
