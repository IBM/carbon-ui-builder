import React from 'react';
import {
	TimePicker,
	TimePickerSelect,
	SelectItem,
	Dropdown,
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { DraggableTileList } from '../components';
import image from './../assets/component-icons/time-picker.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

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
			labelText='Light'
			id='light'
			checked={selectedComponent.light}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				light: checked
		})} />
		<Checkbox
			labelText='Disabled'
			id='disable'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				disabled: checked
		})} />
		<Checkbox
			labelText='Invalid'
			id='invalid'
			checked={selectedComponent.invalid}
			onChange={(checked: boolean) => setComponent({
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
				disabled={componentObj.disabled}
				invalid={componentObj.invalid}
				invalidText={componentObj.invalidText}
				placeholder={componentObj.placeholder}
				labelText={componentObj.label}
				light={componentObj.light}
				size={componentObj.size}>
					<TimePickerSelect disabled={componentObj.disabled} labelText="time-picker-1">
						<SelectItem value="AM" text="AM" />
						<SelectItem value="PM" text="PM" />
					</TimePickerSelect>
					<TimePickerSelect disabled={componentObj.disabled} labelText="time-picker-2">
						{
							componentObj.items.map((step: any, index: number) => <SelectItem
								value={step.value}
								text={step.text}
								key={index}
							/>)
						}
					</TimePickerSelect>
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
		light: false,
		size: 'md',
		value: '',
		items: [
			{
				value: 'timezoneValue1',
				text: 'Time zone 1'
			},
			{
				value: 'timezoneValue2',
				text: 'Time zone 2'
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = "${json.value}";`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
			imports: ['TimePickerModule', 'TimePickerSelectModule'],
			code: ({ json }) => {
				return `<ibm-timepicker
					${angularClassNamesFromComponentObj(json)}
					label="${json.label}"
					${json.light ? '[theme]="light"' : '[theme]="dark"'}
					[invalid]="${json.invalid}"
					[invalidText]="'${json.invalidText}'"
					(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
					[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
					[disabled]="${json.disabled}">
						<ibm-timepicker-select ${json.light
							? '[theme]="light"'
							: '[theme]="dark"'
						}
						[disabled]="${json.disabled}"
						display="inline">
							<option selected value="AM">AM</option>
							<option value="PM">PM</option>
						</ibm-timepicker-select>
						<ibm-timepicker-select ${json.light
							? '[theme]="light"'
							: '[theme]="dark"'
						}
						[disabled]="${json.disabled}"
						display="inline">
							${json.items.map((step: any) => (`<option
								value="${step.value}"
								text="${step.text}">
									${step.text}
								</option>`
							)).join('\n')}
						</ibm-timepicker-select>
					</ibm-timepicker>`;
			}
		},
		react: {
			imports: ['TimePicker','TimePickerSelect','SelectItem'],
			code: ({ json }) => {
				return `<TimePicker
					${reactClassNamesFromComponentObj(json)}
					id="time-picker"
					disabled={${json.disabled}}
					labelText="${json.label}"
					size="${json.size}"
					invalid={${json.invalid}}
					invalidText="${json.invalidText}"
					placeholder="${json.placeholder}"
					light={${json.light}}>
						<TimePickerSelect labelText="time-picker-1" id="time-picker-select-1">
							<SelectItem value="AM" text="AM" />
							<SelectItem value="PM" text="PM" />
						</TimePickerSelect>
						<TimePickerSelect labelText="time-picker-2" id="time-picker-select-2">
							${json.items.map((step: any) => (`<SelectItem
								value="${step.value}"
								text="${step.text}" />`
							)).join('\n')}
						</TimePickerSelect>
					</TimePicker>`;
			}
		}
	}
};
