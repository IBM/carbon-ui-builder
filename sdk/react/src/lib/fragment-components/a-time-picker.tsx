import React from 'react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/time-picker.svg';
import { TextInput } from '@carbon/react';
import { Checkbox } from '@carbon/react';
import { Dropdown } from '@carbon/react';
import { DraggableTileList, angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../helpers';
import { TimePicker } from '@carbon/react';
import { TimePickerSelect } from '@carbon/react';
import { SelectItem } from '@carbon/react';
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
			...selectedComponent.items[index],
			[key]: value
		};
		setComponent({
			...selectedComponent,
			items: [
				...selectedComponent.items.slice(0, index),
				step,
				...selectedComponent.items.slice(index + 1)
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
		</>;
	};

	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};
	return <>
		<Checkbox
			labelText='AM/PM'
			id='apPm'
			checked={selectedComponent.amPm}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				amPm: checked
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
			id="size"
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
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				text: 'New timezone',
				value: 'New timezoneValue'
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
					{componentObj.amPm &&
						<TimePickerSelect disabled={componentObj.disabled}>
							<SelectItem value='AM' text='AM' />
							<SelectItem value='PM' text='PM' />
						</TimePickerSelect>
					}
					{componentObj.items.length > 0 &&
						<TimePickerSelect disabled={componentObj.disabled}>
							{
								componentObj.items.map((step: any, index: number) => <SelectItem
									value={step.value}
									text={step.text}
									key={index}
								/>)
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
		disabled: false,
		invalid: false,
		invalidText: 'A valid value is required',
		placeholder: 'hh:mm',
		label: 'Select a time',
		hideLabel: false,
		light: false,
		amPm: false,
		size: 'md',
		value: '',
		items: []
	},
	image,
	codeExport: {
		angular: {
			latest: {
                inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.value}";
                	@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme: any = "${json.light ? 'light' : 'dark'}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}IsInvalid = ${json.invalid};
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: any = "${json.size}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}IsHideLabel = ${json.hideLabel};
			@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}IsDisabled = ${json.disabled};
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.label}";`,
                outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
                imports: ['TimePickerModule', 'TimePickerSelectModule'],
                code: ({ json }) => {
                    return `<ibm-timepicker
                        ${angularClassNamesFromComponentObj(json)}
                        [label]="${nameStringToVariableString(json.codeContext?.name)}Label"
                        [theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
                        [invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
                        [placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
                        [size]="${nameStringToVariableString(json.codeContext?.name)}Size"
                        [hideLabel]="${nameStringToVariableString(json.codeContext?.name)}IsHideLabel"
                        [invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
                        (valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event)"
                        [value]="${nameStringToVariableString(json.codeContext?.name)}Value"
                        [disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled">
							${json.amPm ?
								`<ibm-timepicker-select
									[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
									[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
									display='inline'>
									<option selected value='AM'>AM</option>
									<option value='PM'>PM</option>
								</ibm-timepicker-select>` : ``
							}
							${json.items.length > 0 ?
								`<ibm-timepicker-select 
									[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
									[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
									display='inline'>
									${json.items.map((step: any) => (`<option
										value="${step.value}"
										text="${step.text}">
											${step.text}
										</option>`
									)).join('\n')}
								</ibm-timepicker-select>`: ``
							}
                        </ibm-timepicker>`;
                }
            },
            v10: {
                inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.value};
                	@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme: any = "${json.light ? 'light' : 'dark'}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}IsInvalid = "${json.invalid}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: any = "${json.size}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}IsHideLabel = "${json.hideLabel}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText}";
			@Input() ${nameStringToVariableString(json.codeContext?.name)}IsDisabled = "${json.disabled}";`,
                outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
                imports: ['TimePickerModule', 'TimePickerSelectModule'],
                code: ({ json }) => {
                    return `<ibm-timepicker
                        ${angularClassNamesFromComponentObj(json)}
                        label="${nameStringToVariableString(json.codeContext?.name)}Label}"
                        [theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
                        [invalid]="${nameStringToVariableString(json.codeContext?.name)}IsInvalid"
                        [placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
                        [size]="${nameStringToVariableString(json.codeContext?.name)}Size"
                        [hideLabel]="${nameStringToVariableString(json.codeContext?.name)}IsHideLabel"
                        [invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
                        (valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
                        [value]="${nameStringToVariableString(json.codeContext?.name)}Value"
                        [disabled]="${json.disabled}">
							${json.amPm ?
								`<ibm-timepicker-select
									[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
									[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
									display='inline'>
									<option selected value='AM'>AM</option>
									<option value='PM'>PM</option>
								</ibm-timepicker-select>` : ``
							}
							${json.items.length > 0 ?
								`<ibm-timepicker-select 
									[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
									[disabled]="${nameStringToVariableString(json.codeContext?.name)}IsDisabled"
									display='inline'>
									${json.items.map((step: any) => (`<option
										value="${step.value}"
										text="${step.text}">
											${step.text}
										</option>`
									)).join('\n')}
								</ibm-timepicker-select>`: ``
							}
                        </ibm-timepicker>`;
                }                             
            }
		},
		react: {
            latest: {
                imports: ['TimePicker','TimePickerSelect','SelectItem'],
                code: ({ json }) => {
                    return `<TimePicker
                        ${reactClassNamesFromComponentObj(json)}
                        disabled={${json.disabled}}
                        labelText="${json.label}"
                        size="${json.size}"
                        invalid={${json.invalid}}
                        invalidText="${json.invalidText}"
                        placeholder="${json.placeholder}"
                        hideLabel={${json.hideLabel}}
                        light={${json.light}}>
							${json.amPm ? 
								`<TimePickerSelect id="${json.codeContext?.name + '-select-1'}">
									<SelectItem value='AM' text='AM' />
									<SelectItem value='PM' text='PM' />
								</TimePickerSelect>` : ``
							}
							${json.timezone ? 
								`<TimePickerSelect id="${json.codeContext?.name + '-select-2'}">
									${json.items.map((step: any) => (`<SelectItem
										value="${step.value}"
										text="${step.text}" />`
									)).join('\n')}
								</TimePickerSelect>` : ``
							}
                        </TimePicker>`;
                }
            },
            v10: {
                imports: ['TimePicker','TimePickerSelect','SelectItem'],
                code: ({ json }) => {
                    return `<TimePicker
                        ${reactClassNamesFromComponentObj(json)}
                        disabled={${json.disabled}}
                        labelText="${json.label}"
                        size="${json.size}"
                        invalid={${json.invalid}}
                        invalidText="${json.invalidText}"
                        placeholder="${json.placeholder}"
                        hideLabel={${json.hideLabel}}
                        light={${json.light}}>
							${json.amPm ? 
								`<TimePickerSelect id="${json.codeContext?.name + '-select-1'}">
									<SelectItem value='AM' text='AM' />
									<SelectItem value='PM' text='PM' />
								</TimePickerSelect>` : ``
							}
							${json.timezone ? 
								`<TimePickerSelect id="${json.codeContext?.name + '-select-2'}">
									${json.items.map((step: any) => (`<SelectItem
										value="${step.value}"
										text="${step.text}" />`
									)).join('\n')}
								</TimePickerSelect>` : ``
							}
                        </TimePicker>`;
                }
            }
		}
	}
};
