import React from 'react';
import {
	Checkbox,
	Dropdown,
	MultiSelect,
	TextInput
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentInfo } from '.';
import { DraggableTileList } from '../components';

import image from './../assets/component-icons/dropdown.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const ADropdownSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	const directionItems = [
		{ id: 'bottom' },
		{ id: 'top' }
	];

	const selectionFeedbackItems = [
		{ id: 'top' },
		{ id: 'fixed' },
		{ id: 'top-after-reopen' }
	];

	const handleItemUpdate = (key: string, value: any, index: number) => {
		const item = {
			...selectedComponent.listItems[index],
			[key]: value
		};

		setComponent({
			...selectedComponent,
			listItems: [
				...selectedComponent.listItems.slice(0, index),
				item,
				...selectedComponent.listItems.slice(index + 1)
			]
		});
	};

	const template = (item: any, index: number) => {
		return <>
			<TextInput
				light
				value={item.text}
				labelText='Display text'
				onChange={(event: any) => handleItemUpdate('text', event.currentTarget.value, index)} />
			{
				selectedComponent.isMulti &&
				<div style={{ display: 'flex' }}>
					<Checkbox
						style={{ display: 'inline-flex' }}
						labelText='Is default selected'
						id={`invalid-select-${index}`}
						checked={item.selected}
						onChange={(checked: any) => handleItemUpdate('selected', checked, index)} />
				</div>
			}
		</>;
	};

	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			listItems: newList
		});
	};

	return <>
		<Checkbox
			labelText='Is multiselect'
			id='multiselect-label'
			checked={selectedComponent.isMulti}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				isMulti: checked
			})} />
		<Checkbox
			labelText='Is inline'
			id='inline-label'
			checked={selectedComponent.isInline}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				isInline: checked
			})} />
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
		<Dropdown
			label='Direction'
			titleText='Dropdown direction'
			items={directionItems}
			selectedItem={directionItems.find(item => item.id === selectedComponent.direction)}
			itemToString={(item: any) => (item ? item.id : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				direction: event.selectedItem.id
			})} />
		<Dropdown
			label='Feedback'
			titleText='Selection feedback'
			items={selectionFeedbackItems}
			selectedItem={selectionFeedbackItems.find(item => item.id === selectedComponent.selectionFeedback)}
			itemToString={(item: any) => (item ? item.id : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				selectionFeedback: event.selectedItem.id
			})} />
		<TextInput
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				label: event.currentTarget.value
			})} />
		<Checkbox
			labelText='Hide label'
			id='hide-label'
			checked={selectedComponent.hideLabel}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				hideLabel: checked
			})} />
		<TextInput
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				placeholder: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.helperText}
			labelText='Helper text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				helperText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.warnText}
			labelText='Warning text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				warnText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.invalidText}
			labelText='Invalid text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				invalidText: event.currentTarget.value
			})} />
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				light: checked
			})} />
		<hr />
		<h4>Items</h4>
		<DraggableTileList
			dataList={[...selectedComponent.listItems]}
			setDataList={updateStepList}
			updateItem={handleItemUpdate}
			defaultObject={{
				text: 'Text'
			}}
			template={template} />
		<hr />
	</>;
};

export const ADropdownCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
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
};

const preventClickStyle = css`
	pointer-events: none;
`;

export const ADropdown = ({
	componentObj,
	...rest
}: any) => {
	// Determine which React Component to render based on dropdownType
	let DropdownOrMultiSelect = Dropdown;
	if (componentObj.isMulti) {
		DropdownOrMultiSelect = MultiSelect;
	}

	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		{...rest}>
			<DropdownOrMultiSelect
				id={componentObj.codeContext?.name}
				label={componentObj.placeholder}
				titleText={componentObj.label}
				size={componentObj.size}
				light={componentObj.light}
				disabled={componentObj.disabled}
				helperText={componentObj.helperText}
				type={componentObj.isInline ? 'inline' : 'default'}
				warn={componentObj.warn}
				warnText={componentObj.warnText}
				hideLabel={componentObj.hideLabel}
				invalid={componentObj.invalid}
				invalidText={componentObj.invalidText}
				direction={componentObj.direction}
				items={[]}
				className={`${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} ${preventClickStyle}`} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	type: 'dropdown',
	component: ADropdown,
	settingsUI: ADropdownSettingsUI,
	codeUI: ADropdownCodeUI,
	keywords: ['dropdown', 'multiselect', 'select'],
	name: 'Dropdown',
	defaultComponentObj: {
		type: 'dropdown',
		placeholder: 'placeholder',
		isMulti: false,
		isInline: false,
		selectionFeedback: 'top-after-reopen',
		direction: 'bottom',
		size: 'md',
		label: 'Label',
		helperText: 'Optional helper text',
		listItems: [
			{
				text: 'Text'
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => {
				const name = nameStringToVariableString(json.codeContext?.name);
				const items = json.listItems.map((item: any) => ({
					content: item.text,
					...(json.isMulti && item.selected) && { selected: item.selected }
				}));

				return `@Input() ${name}Label = "${json.label}";
				@Input() ${name}HelperText = "${json.helperText}";
				@Input() ${name}Placeholder = "${json.placeholder}";
				@Input() ${name}Theme = "${json.light ? 'light' : 'dark'}";
				@Input() ${name}Invalid = ${!!json.invalid};
				@Input() ${name}InvalidText = "${json.invalidText ? json.invalidText : ''}";
				@Input() ${name}Size = "${json.size}";
				@Input() ${name}Warn = ${!!json.warn};
				@Input() ${name}WarnText = "${json.warnText ? json.warnText : ''}";
				@Input() ${name}Disabled = ${!!json.disabled};
				@Input() ${name}DropUp = ${json.direction !== 'bottom'};
				@Input() ${name}SelectionFeedback = "${json.selectionFeedback}";
				@Input() ${name}Type: "single" | "multi" = "${json.isMulti ? 'multi' : 'single'}";
				@Input() ${name}Items = ${JSON.stringify(items)};`;
			},
			outputs: ({ json }) =>{
				const name = nameStringToVariableString(json.codeContext?.name);
				return `@Output() ${name}Selected = new EventEmitter<any>();
					@Output() ${name}Close = new EventEmitter<any>();`;
			},
			imports: ['DropdownModule'],
			code: ({ json }) => {
				const name = nameStringToVariableString(json.codeContext?.name);
				return `<ibm-dropdown
					[label]="${name}Label"
					[helperText]="${name}HelperText"
					[placeholder]="${name}Placeholder"
					[theme]="${name}Theme"
					[invalid]="${name}Invalid"
					[invalidText]="${name}InvalidText"
					[size]="${name}Size"
					[warn]="${name}Warn"
					[warnText]="${name}WarnText"
					[disabled]="${name}Disabled"
					[dropUp]="${name}DropUp"
					[selectionFeedback]="${name}SelectionFeedback"
					[type]="${name}Type"
					(selected)="${name}Selected.emit(event)"
					(close)="${name}Close.emit(event)"
					${angularClassNamesFromComponentObj(json)}>
					<ibm-dropdown-list [items]="${name}Items"></ibm-dropdown-list>
				</ibm-dropdown>`;
			}
		},
		react: {
			imports: ({ json }) => [json.isMulti ? 'MultiSelect': 'Dropdown'],
			code: ({ json }) => {
				const name = nameStringToVariableString(json.codeContext?.name);

				// Items are required
				return `<${json.isMulti ? 'MultiSelect' : 'Dropdown'}
					id="${name}"
					titleText="${json.label}"
					helperText="${json.helperText}"
					label="${json.placeholder}"
					${json.isInline ? 'type="inline"': ''}
					${json.selectionFeedback !== 'top-after-reopen' && json.isMulti ? `selectionFeedback="${json.selectionFeedback}"` : ''}
					${json.hideLabel !== undefined ? `hideLabel={${json.hideLabel}}` : ''}
					${json.direction !== 'bottom' ? `direction="${json.direction}"` : ''}
					${json.light ? `light="${json.light}"` : ''}
					${json.size !== 'md' ? `size="${json.size}"` : ''}
					items={${name}Items}
					itemToString={${name}ItemsToString}
					initialSelectedItem${json.isMulti ? 's' : ''}={${name}DefaultSelected}
					onChange={(selectedItem) => handleInputChange({
						target: {
							name: "${name}",
							value: selectedItem
						}
					})}
					${reactClassNamesFromComponentObj(json)}
				/>`;
			},
			additionalCode: (json) => {
				const name = nameStringToVariableString(json.codeContext?.name);
				const itemsKey = `${name}Items`;
				const itemsToStringKey = `${name}ItemsToString`;
				const itemsDefaultSelectedKey = `${name}DefaultSelected`;
				return {
					[itemsKey]: `const ${itemsKey} = state["${name}Items"] || ${json.listItems ?
						JSON.stringify(json.listItems) : '[]'};`,
					[itemsToStringKey]: `const ${itemsToStringKey} = state["${name}ItemToString"] || ((item) => (item ? item.text : ""));`,
					[itemsDefaultSelectedKey]: `const ${itemsDefaultSelectedKey} = state["${name}initialSelectedItems"] || ${json.isMulti ?
						`(${itemsKey}.filter(item => item.selected))`: `(${itemsKey}.find(item => item.selected))`};`
				};
			}
		}
	}
};
