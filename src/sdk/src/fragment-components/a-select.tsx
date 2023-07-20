import React from 'react';
import {
	TextInput,
	Select,
	SelectItem,
	SelectItemGroup,
	Checkbox,
	Dropdown,
	Button
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/select.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj,
	updatedState
} from '../tools';
import { DraggableTileList } from '../draggable-list';
import { css } from 'emotion';

const iconStyle = css`
	min-height: 1rem;
	float: right;
	cursor: pointer;
`;

const addButtonStyle = css`
	width: 100%;
	display: flex;
	justify-content: center;
`;

const checkBoxContainer = css`
	display:flex; 
	margin-top: 0.1825rem;
`;

export const ASelectSettingsUI = ({ selectedComponent, setComponent, fragment, setFragment }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};

	const updateListItems = (key: string, value: any, index: number, list: any) => {
		const step = {
			...list.items[index],
			[key]: value
		};
		setComponent({
			...list,
			items: [
				...list.items.slice(0, index),
				step,
				...list.items.slice(index + 1)
			]
		});
	};

	const addOption = (offset = 0, itemsList: any) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'select-item',
					text: 'New option',
					value: 'new-option'
				}
			},
			itemsList.id,
			itemsList.items.indexOf(itemsList) + offset
		)
	});

	const addNewCategory = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					label: 'New category',
					disabled: false,
					items: [{
						type: 'select-item',
						text: 'New option',
						value: 'new-option'
					}]
				}
			},
			selectedComponent.id,
			selectedComponent.items.indexOf(selectedComponent) + offset
		)
	});

	const template = (selectedItem: any, index: number) => <>
		{
			selectedItem.items && selectedItem.items.length > 0 ? <>
				<TextInput
					light
					value={selectedItem.label}
					labelText='Category label'
					onChange={(event: any) => updateListItems('label', event.currentTarget.value, index, selectedComponent)} />
				<section className={checkBoxContainer}>
					<Checkbox
						labelText='Disabled'
						id={`disabled-${index}`}
						checked={selectedItem.disabled}
						onChange={(checked: boolean) => updateListItems('disabled', checked, index, selectedComponent)} />
					<Button
						size="sm"
						kind="ghost"
						className={iconStyle}
						onClick={(event: any) => {
							event.stopPropagation();
							addOption(0, selectedItem);
						}}>
							Add item
					</Button>
				</section>
				{
					selectedItem.items.map((child: any, childIndex: any) => <>
						{/* category items */}
						<TextInput
							light
							value={child.text}
							key={`child-text-${index}-${childIndex}-${child.text}`}
							labelText='Option value'
							onChange={(event: any) => updateListItems('text', event.currentTarget.value, childIndex, selectedItem)} />
						
						<section className={checkBoxContainer}>
						<Checkbox
							labelText='Disabled'
							id={`child-disabled-${index}--${childIndex}-${child.text}`}
							checked={child.disabled}
							onChange={(checked: boolean) => updateListItems('disabled', checked, childIndex, selectedItem)} />
						<Checkbox
							labelText='Hidden'
							id={`child-hidden-${index}--${childIndex}-${child.text}`}
							checked={child.hidden}
							onChange={(checked: boolean) => updateListItems('hidden', checked, childIndex, selectedItem)} />
						</section>
					</>)
				} </> : <>
					{/* standalone option items */}
					<TextInput
						light
						value={selectedItem.text}
						labelText='Option value'
						onChange={(event: any) => updateListItems('text', event.currentTarget.value, index, selectedComponent)} />
					<section className={checkBoxContainer}>
						<Checkbox
							labelText='Disabled'
							id={`disabled-${index}`}
							checked={selectedItem.disabled}
							onChange={(checked: boolean) => updateListItems('disabled', checked, index, selectedComponent)} />
						<Checkbox
							labelText='Hidden'
							id={`hidden-${index}`}
							checked={selectedItem.hidden}
							onChange={(checked: boolean) => updateListItems('hidden', checked, index, selectedComponent)} />
					</section>
				</>
		}
	</>;

	return <>
		<Dropdown
			id='size-dropdown'
			label='Select size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />

		<TextInput
			value={selectedComponent.labelText}
			labelText='Select value'
			onChange={(event: any) => setComponent({ ...selectedComponent, labelText: event.currentTarget.value })} />

		<TextInput
			value={selectedComponent.invalidText}
			labelText='Invalid text value'
			onChange={(event: any) => setComponent({ ...selectedComponent, invalidText: event.currentTarget.value })} />

		<TextInput
			value={selectedComponent.warnText}
			labelText='Warning text value'
			onChange={(event: any) => setComponent({ ...selectedComponent, warnText: event.currentTarget.value })} />

		<section className={checkBoxContainer}>
			<Checkbox
				labelText='Warning'
				id='warning-label'
				checked={selectedComponent.warn}
				onChange={(checked: boolean) => setComponent({ ...selectedComponent, warn: checked })} />

			<Checkbox
				labelText='Disabled'
				id='disable-label'
				checked={selectedComponent.disabled}
				onChange={(checked: boolean) => setComponent({ ...selectedComponent, disabled: checked })} />

		</section>

		<section className={checkBoxContainer}>
			<Checkbox
				labelText='Inline'
				id='inline'
				checked={selectedComponent.inline}
				onChange={(checked: boolean) => setComponent({ ...selectedComponent, inline: checked })} />

			<Checkbox
				labelText='Invalid'
				id='invalid'
				checked={selectedComponent.invalid}
				onChange={(checked: boolean) => setComponent({ ...selectedComponent, invalid: checked })} />
		</section>

		<hr />
		<h4>Option items</h4>
		<Button
			className={addButtonStyle}
			size="sm"
			kind="ghost"
			onClick={(event: any) => {
				event.stopPropagation();
				addNewCategory();
			}}>Add new category</Button>
		
		<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				text: 'New option',
				value: 'new-option',
				disabled: false,
				hidden: false
			}}
			template={template} />
	</>;
};

export const ASelectCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ASelect = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<Select
			id='select'
			defaultValue={componentObj.defaultValue}
			helperText={componentObj.helperText}
			invalidText={componentObj.invalidText}
			warn={componentObj.warn}
			warnText={componentObj.warnText}
			labelText={componentObj.labelText}
			size={componentObj.size}
			inline={componentObj.inline}
			invalid={componentObj.invalid}
			disabled={componentObj.disabled}>
			{
				componentObj.items.map((step: any, index: any) =>
					step.items && step.items.length > 0
						?
					<SelectItemGroup
					key={index}
					label={step.label}
					disabled={step.disabled}>
					{
						step.items.map((child: any, index: any) => <SelectItem
							text={child.text}
							value={child.value}
							disabled={child.disabled}
							hidden={child.hidden}
							key={index} />)
					}
					</SelectItemGroup>
						:
					<SelectItem
						text={step.text}
						value={step.value}
						disabled={step.disabled}
						hidden={step.hidden}
						key={index} />
				)
			}
			</Select>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASelect,
	settingsUI: ASelectSettingsUI,
	codeUI: ASelectCodeUI,
	render: ({ componentObj, select, remove, selected }) => <ASelect
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
	</ASelect>,
	keywords: ['select'],
	name: 'Select',
	type: 'select',
	defaultComponentObj: {
		type: 'select',
		size: 'md',
		labelText: 'Select',
		items: [
			{
				text: 'Option 1',
				value: 'placeholder-item',
				type: 'select-item'
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Size = "${json.size}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Invalid = ${json.invalid};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.labelText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}HelperText = "${json.helperText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}WarnText = "${json.warnText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Warn = ${json.warn};`,
			outputs: (_) => '',
			imports: ['SelectModule'],
			code: ({ json }) => {
				return `<ibm-select
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					[warn]="${nameStringToVariableString(json.codeContext?.name)}Warn"
					[warnText]="${nameStringToVariableString(json.codeContext?.name)}WarnText"
					[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
					[invalid]="${nameStringToVariableString(json.codeContext?.name)}Invalid"
					[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
					[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
					[helperText]="${nameStringToVariableString(json.codeContext?.name)}HelperText"
					${json.inline ? '[display]="inline"' : '[display]="default"'}
					${angularClassNamesFromComponentObj(json)}>
					${json.items.map((step: any) =>
						step.items && step.items.length > 0 ? `<optgroup
						label="${step.label}"
						${step.disabled ? 'disabled' : ''}>
						${step.items.map((child: any) => `<option
							value="${child.value}"
							${child.disabled ? 'disabled' : ''}
							${child.hidden ? 'hidden' : ''}>
								${child.text}
							</option>`
						).join('\n')}
						</optgroup>` : `<option
						value="${step.value}"
						${step.disabled ? 'disabled' : ''}
						${step.hidden ? 'hidden' : ''}>
							${step.text}
						</option>`
					).join('\n')}
				</ibm-select>
`;
			}
		},
		react: {
			imports: ['Select', 'SelectItem', 'SelectItemGroup'],
			code: ({ json }) => {
				return `<Select
					id="select"
					size="${json.size}"
					warn={${json.warn}}
					warnText="${json.warnText}"
					defaultValue="${json.defaultValue}"
					helperText="${json.helperText}"
					invalidText="${json.invalidText}"
					labelText="${json.labelText}"
					inline={${json.inline}}
					invalid={${json.invalid}}
					disabled={${json.disabled}}
					${reactClassNamesFromComponentObj(json)}>
					${json.items.map((step: any, index: any) =>
						step.items && step.items.length > 0
							?
						`<SelectItemGroup
						key={${index}}
						label="${step.label}"
						disabled={${step.disabled}}>
						${step.items.map((child: any, index: any) => `<SelectItem
							text="${child.text}"
							value="${child.value}"
							disabled={${child.disabled}}
							hidden={${child.hidden}}
							key={${index}} />`
						).join('\n')}
						</SelectItemGroup>`
							:
						`<SelectItem
							text="${step.text}"
							value="${step.value}"
							disabled={${step.disabled}}
							hidden={${step.hidden}}
							key={${index}} />`
					).join('\n')}
				</Select>`;
			}
		}
	}
};
