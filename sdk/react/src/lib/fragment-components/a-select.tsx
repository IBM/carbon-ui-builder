import React from 'react';
import {
	TextInput,
	Select,
	SelectItem,
	SelectItemGroup,
	Checkbox,
	Dropdown,
	Button
} from '@carbon/react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/select.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj,
	updatedState
} from '../helpers/tools';
import { DraggableTileList } from '../helpers/draggable-list';
import { css, cx } from 'emotion';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

const addOptionButtonStyle = css`
	min-height: 1rem;
	float: right;
	cursor: pointer;
`;

const addCategoryButtonStyle = css`
	width: 100%;
	display: flex;
	justify-content: center;
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
					value: 'new-option',
					isShowDeveloperOption: itemsList.isShowDeveloperOption
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
					isShowDeveloperOption: false,
					items: [{
						type: 'select-item',
						text: 'New option',
						value: 'new-option',
						isShowDeveloperOption: false
					}]
				}
			},
			selectedComponent.id,
			selectedComponent.items.indexOf(selectedComponent) + offset
		)
	});

	const template = (selectedItem: any, index: number) => <>
		{
			// category template conditioned on that it has any chidren items
			selectedItem.items && selectedItem.items.length > 0 ? <>
				<TextInput
					light
					value={selectedItem.label}
					labelText='Category label'
					onChange={(event: any) => updateListItems('label', event.currentTarget.value, index, selectedComponent)} />
				<section>
					<Checkbox
						labelText='Disabled'
						id={`disabled-${index}`}
						checked={selectedItem.disabled}
						onChange={(_: any, { checked }: any) => updateListItems('disabled', checked, index, selectedComponent)} />
					<Button
						size='sm'
						kind='ghost'
						className={addOptionButtonStyle}
						onClick={(event: any) => {
							event.stopPropagation();
							addOption(0, selectedItem);
						}}>
							Add item
					</Button>
				</section>
				{
					selectedItem.items.map((child: any, childIndex: any) => <>
						<hr />
						{/* category items */}
						<TextInput
							light
							value={child.text}
							key={`text-${child.id}`}
							labelText='Option display text'
							onChange={(event: any) => updateListItems('text', event.currentTarget.value, childIndex, selectedItem)} />

						<section>
							<Checkbox
								labelText='Disabled'
								id={`isDisabled-checkbox-${child.id}`}
								checked={child.disabled}
								onChange={(_: any, { checked }: any) => updateListItems('disabled', checked, childIndex, selectedItem)} />
							<Checkbox
								labelText='Hidden'
								id={`isHidden-checkbox-${child.id}`}
								checked={child.hidden}
								onChange={(_: any, { checked }: any) => updateListItems('hidden', checked, childIndex, selectedItem)} />
						</section>
						{
							child.isShowDeveloperOption &&
							<TextInput
								light
								value={child.value}
								key={`child-value-${index}-${childIndex}-${child.text}`}
								labelText='Option value'
								onChange={(event: any) => updateListItems('value', event.currentTarget.value, childIndex, selectedItem)} />
						}
					</>)
				} </> : <>
				{/* standalone option items */}
					<TextInput
						light
						value={selectedItem.text}
						labelText='Option display text'
						onChange={(event: any) => updateListItems('text', event.currentTarget.value, index, selectedComponent)} />
					<section>
						<Checkbox
							labelText='Disabled'
							id={`disabled-${index}`}
							checked={selectedItem.disabled}
							onChange={(_: any, { checked }: any) => updateListItems('disabled', checked, index, selectedComponent)} />
						<Checkbox
							labelText='Hidden'
							id={`hidden-${index}`}
							checked={selectedItem.hidden}
							onChange={(_: any, { checked }: any) => updateListItems('hidden', checked, index, selectedComponent)} />
					</section>
					{
						selectedItem.isShowDeveloperOption &&
						<TextInput
							light
							value={selectedItem.value}
							labelText='Option value'
							onChange={(event: any) => updateListItems('value', event.currentTarget.value, index, selectedComponent)} />
					}
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
			value={selectedComponent.label}
			labelText='Select value'
			onChange={(event: any) => setComponent({ ...selectedComponent, label: event.currentTarget.value })} />

		<TextInput
			value={selectedComponent.helperText}
			labelText='Helper text'
			onChange={(event: any) => setComponent({ ...selectedComponent, helperText: event.currentTarget.value })} />

		<TextInput
			value={selectedComponent.invalidText}
			labelText='Invalid text value'
			onChange={(event: any) => setComponent({ ...selectedComponent, invalidText: event.currentTarget.value })} />

		<TextInput
			value={selectedComponent.warnText}
			labelText='Warning text value'
			onChange={(event: any) => setComponent({ ...selectedComponent, warnText: event.currentTarget.value })} />

		<section>
			<Checkbox
				labelText='Warning'
				id='warning-label'
				checked={selectedComponent.warn}
				onChange={(_: any, { checked }: any) => setComponent({ ...selectedComponent, warn: checked })} />

			<Checkbox
				labelText='Disabled'
				id='disable-label'
				checked={selectedComponent.disabled}
				onChange={(_: any, { checked }: any) => setComponent({ ...selectedComponent, disabled: checked })} />

		</section>

		<section>
			<Checkbox
				labelText='Inline'
				id='inline'
				checked={selectedComponent.inline}
				onChange={(_: any, { checked }: any) => setComponent({ ...selectedComponent, inline: checked })} />

			<Checkbox
				labelText='Invalid'
				id='invalid'
				checked={selectedComponent.invalid}
				onChange={(_: any, { checked }: any) => setComponent({ ...selectedComponent, invalid: checked })} />
		</section>

		<hr />
		<h4>Option items</h4>
		<Button
			className={addCategoryButtonStyle}
			size='sm'
			kind='ghost'
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
				hidden: false,
				isShowDeveloperOption: false
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
			className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
			defaultValue={componentObj.defaultValue}
			helperText={componentObj.helperText}
			invalidText={componentObj.invalidText}
			warn={componentObj.warn}
			warnText={componentObj.warnText}
			labelText={componentObj.label}
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
	keywords: ['select'],
	name: 'Select',
	type: 'select',
	defaultComponentObj: {
		type: 'select',
		label: 'Select',
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
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Invalid = ${json.invalid ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Warn = ${json.warn ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Inline: "inline" | "default"
					= "${json.inline ? 'inline' : 'default'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: "sm" | "md" | "lg" = "${json.size ?? 'md'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.label ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}HelperText = "${json.helperText ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}WarnText = "${json.warnText ?? ''}";`,
				outputs: (_) => '',
				imports: ['SelectModule'],
				code: ({ json }) => {
					return `<cds-select
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
						[warn]="${nameStringToVariableString(json.codeContext?.name)}Warn"
						[warnText]="${nameStringToVariableString(json.codeContext?.name)}WarnText"
						[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
						[invalid]="${nameStringToVariableString(json.codeContext?.name)}Invalid"
						[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
						[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
						[helperText]="${nameStringToVariableString(json.codeContext?.name)}HelperText"
						[display]="${nameStringToVariableString(json.codeContext?.name)}Inline"
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
					</cds-select>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Invalid = ${json.invalid ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Warn = ${json.warn ?? false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Inline: "inline" | "default"
					= "${json.inline ? 'inline' : 'default'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Size: "sm" | "md" | "lg" = "${json.size ?? 'md'}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.label ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}HelperText = "${json.helperText ?? ''}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}WarnText = "${json.warnText ?? ''}";`,
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
						[display]="${nameStringToVariableString(json.codeContext?.name)}Inline"
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
					</ibm-select>`;
				}
			}
		},
		react: {
			latest: {
				imports:({ json }) => {
					const selectItem = json.items?.length ? ['SelectItem'] : [];
					const selectItemGroup = json.items && json.items[0].items?.length > 0 ? ['SelectItemGroup'] : [];
					return ['Select', ...selectItem, ...selectItemGroup];
				},
				code: ({ json }) => {
					return `<Select
						id="select"
						size="${json.size}"
						labelText="${json.label}"
						${json.warnText ? `warnText="${json.warnText}"` : ''}
						${json.warn ? `warn={${json.warn}}` : ''}
						${json.defaultValue ? `defaultValue=${json.defaultValue}`: ''}
						${json.helperText ? `helperText=${json.helperText}`: ''}
						${json.invalidText ? `invalidText="${json.invalidText}"`: ''}
						${json.inline ? `inline={${json.inline}}`: ''}
						${json.invalid ? `invalid={${json.invalid}}`: ''}
						${json.disabled ? `disabled={${json.disabled}}`: ''}
						${reactClassNamesFromComponentObj(json)}>
						${json.items.map((step: any, index: any) =>
							step.items && step.items.length > 0
								?
							`<SelectItemGroup
							key="${index}"
							label="${step.label}"
							${step.disabled ? `disabled={${step.disabled}}`: ''}>
							${step.items.map((child: any, index: any) => `<SelectItem
								text="${child.text}"
								value="${child.value}"
								${child.disabled ? `disabled={${child.disabled}}`: ''}
								${child.hidden ? `hidden={${child.hidden}}`: ''}
								key="${index}" />`
							).join('\n')}
							</SelectItemGroup>`
								:
							`<SelectItem
								text="${step.text}"
								value="${step.value}"
								${step.disabled ? `disabled={${step.disabled}}`: ''}
								${step.hidden ? `hidden={${step.hidden}}`: ''}
								key="${index}" />`
						).join('\n')}
					</Select>`;
				}
			},
			v10: {
				imports:({ json }) => {
					const selectItem = json.items?.length ? ['SelectItem'] : [];
					const selectItemGroup = json.items && json.items[0].items?.length > 0 ? ['SelectItemGroup'] : [];
					return ['Select', ...selectItem, ...selectItemGroup];
				},
				code: ({ json }) => {
					return `<Select
						id="select"
						size="${json.size}"
						labelText="${json.label}"
						${json.warnText ? `warnText="${json.warnText}"` : ''}
						${json.warn ? `warn={${json.warn}}` : ''}
						${json.defaultValue ? `defaultValue=${json.defaultValue}`: ''}
						${json.helperText ? `helperText=${json.helperText}`: ''}
						${json.invalidText ? `invalidText="${json.invalidText}"`: ''}
						${json.inline ? `inline={${json.inline}}`: ''}
						${json.invalid ? `invalid={${json.invalid}}`: ''}
						${json.disabled ? `disabled={${json.disabled}}`: ''}
						${reactClassNamesFromComponentObj(json)}>
						${json.items.map((step: any, index: any) =>
							step.items && step.items.length > 0
								?
							`<SelectItemGroup
							key="${index}"
							label="${step.label}"
							${step.disabled ? `disabled={${step.disabled}}`: ''}>
							${step.items.map((child: any, index: any) => `<SelectItem
								text="${child.text}"
								value="${child.value}"
								${child.disabled ? `disabled={${child.disabled}}`: ''}
								${child.hidden ? `hidden={${child.hidden}}`: ''}
								key="${index}" />`
							).join('\n')}
							</SelectItemGroup>`
								:
							`<SelectItem
								text="${step.text}"
								value="${step.value}"
								${step.disabled ? `disabled={${step.disabled}}`: ''}
								${step.hidden ? `hidden={${step.hidden}}`: ''}
								key="${index}" />`
						).join('\n')}
					</Select>`;
				}
			}
		}
	}
};
