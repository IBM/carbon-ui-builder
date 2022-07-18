import React from 'react';
import {
	DatePicker,
	TimePicker,
	TimePickerSelect,
	SelectItem,
	DatePickerInput,
	Dropdown,
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { DraggableTileList } from '../components';
import image from './../assets/component-icons/link.svg';

export const ADatePickerSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const size = [
		{ id: 'sm', text: 'Small' },
		{ id: 'medium', text: 'Medium' },
		{ id: 'xl', text: 'Extra large' }
	];
	const datePickerType = [
		{ id: 'simple', text: 'Simple' },
		{ id: 'single', text: 'Single with calender' },
		{ id: 'range', text: 'Range with calender' },
		{ id: 'timePicker', text: 'Time picker' }
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
				}}
			/>
			<TextInput
				light
				value={item.value}
				labelText='Value'
				onChange={(event: any) => {
					updateListItems('value', event.currentTarget.value, index);
				}}
			/>
		</>
	}
	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};
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
		})}/>
		<Checkbox
				labelText='Light'
				id='light'
				checked={selectedComponent.light}
				onChange={(checked: boolean) => {
					setComponent({
						...selectedComponent,
						light: checked
					});
				}}
			/>
		{
			selectedComponent.datePickerType !== 'timePicker' ? <>
			<Dropdown
				label='Size'
				titleText='Size'
				items={size}
				selectedItem={size.find(item => item.id === selectedComponent.size)}
				itemToString={(item: any) => (item ? item.text : '')}
				onChange={(event: any) => setComponent({
					...selectedComponent,
					size: event.selectedItem.id
			})}/>
			<Checkbox
				labelText='Disabled'
				id='disable'
				checked={selectedComponent.disabled}
				onChange={(checked: boolean) => {
					setComponent({
						...selectedComponent,
						disabled: checked
					});
				}}
			/>
			<Checkbox
				labelText='Invalid'
				id='invalid'
				checked={selectedComponent.invalid}
				onChange={(checked: boolean) => {
					setComponent({
						...selectedComponent,
						invalid: checked
					});
				}}
			/>
			<TextInput
				value={selectedComponent.rangeStartLabel}
				labelText='Date picker label'
				onChange={(event: any) => {
					setComponent({
						...selectedComponent,
						rangeStartLabel: event.currentTarget.value
					});
				}}
			/>
			{ selectedComponent.datePickerType === 'range' && <>
				<TextInput
					value={selectedComponent.rangeEndLabel}
					labelText='Date picker label'
					onChange={(event: any) => {
						setComponent({
							...selectedComponent,
							rangeEndLabel: event.currentTarget.value
						});
					}}
				/>
			</>
			}
		</> :
		<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				text: 'New timezone',
				value: 'New timezoneValue'
			}}
			template={template} />
		}
	</>;
};

export const ADatePickerCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
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
	</>;
};

export const ADatePicker = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			{
				componentObj.datePickerType === 'timePicker' ?
				<TimePicker id="time-picker" light={componentObj.light}>
				<TimePickerSelect id="time-picker-select-1">
					<SelectItem value="AM" text="AM" />
					<SelectItem value="PM" text="PM" />
				</TimePickerSelect>
				<TimePickerSelect id="time-picker-select-2" >
					{
						componentObj.items.map((step: any, index: number) => <SelectItem
							value={step.value}
							text={step.text}
							key={index}
						/>)
					}
				</TimePickerSelect>
				</TimePicker> :
				<DatePicker dateFormat="m/d/Y" datePickerType={componentObj.datePickerType} light={componentObj.light}>
					<DatePickerInput
						id="date-picker-default-id"
						placeholder="mm/dd/yyyy"
						labelText={componentObj.rangeStartLabel}
						type="text"
						size={componentObj.size}
						disabled={componentObj.disabled}
						invalid={componentObj.invalid}
					/>
					{
						componentObj.datePickerType === 'range' ?
							<DatePickerInput
								id="date-picker-range-end"
								placeholder="mm/dd/yyyy"
								labelText={componentObj.rangeEndLabel}
								type="text"
								size={componentObj.size}
								disabled={componentObj.disabled}
								invalid={componentObj.invalid}
							/>
						: <></>
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
	type: 'datepicker',
	defaultComponentObj: {
		type: 'datepicker',
		disabled: false,
		invalid: false,
		light: false,
		size: 'sm',
		datePickerType: 'simple',
		rangeStartLabel: 'Date picker label',
		rangeEndLabel: 'Date picker label',
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
			inputs: ({ json }) => ``,
			outputs: ({ json }) => ``,
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		},
		react: {
			imports: ['DatePicker','TimePicker','TimePickerSelect','SelectItem','DatePickerInput'],
			code: ({ json }) => {
				return `${json.datePickerType === 'timePicker' ?
					`<TimePicker id="time-picker" light={${json.light}}>
					<TimePickerSelect id="time-picker-select-1">
						<SelectItem value="AM" text="AM" />
						<SelectItem value="PM" text="PM" />
					</TimePickerSelect>
					<TimePickerSelect id="time-picker-select-2" >
						${json.items.map((step: any) => (
							`<SelectItem value="${step.value}" text="${step.text}" />`
						)).join('\n')}
					</TimePickerSelect>
					</TimePicker>` :
					`<DatePicker dateFormat="m/d/Y" datePickerType="${json.datePickerType}" light={${json.light}}>
						<DatePickerInput
							id="date-picker-default-id"
							placeholder="mm/dd/yyyy"
							labelText="${json.rangeStartLabel}"
							type="text"
							size="${json.size}"
							disabled={${json.disabled}}
							invalid={${json.invalid}}
						/>
						${json.datePickerType === 'range' ?
						`<DatePickerInput
							id="date-picker-range-end"
							placeholder="mm/dd/yyyy"
							labelText="${json.rangeEndLabel}"
							type="text"
							size="${json.size}"
							disabled={${json.disabled}}
							invalid={${json.invalid}} />`
						: '' }
					</DatePicker>`
				}`
			}
		}
	}
};
