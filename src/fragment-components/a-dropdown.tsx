import React from 'react';
import {
	Checkbox,
	Dropdown,
	MultiSelect,
	TextInput
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/dropdown.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';


let selectedDropdownType = 'dropdown';

export const ADropdownStyleUI = ({ selectedComponent, setComponent }: any) => {
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

	return <>
		<Checkbox
			labelText='Is multiselect'
			id='multiselect-label'
			checked={selectedComponent.isMulti}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					isMulti: checked
				})
			}}
		/>
		<Dropdown
			label='Size'
			titleText='Size'
			items={[]}
			initialSelectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
		<Dropdown
			label='Direction'
			titleText='Dropdown direction'
			items={directionItems}
			initialSelectedItem={directionItems.find(item => item.id === selectedComponent.direction)}
			itemToString={(item: any) => (item ? item.id : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				direction: event.selectedItem.id
			})} />
		<Dropdown
			label='Feedback'
			titleText='Selection feedback'
			items={selectionFeedbackItems}
			initialSelectedItem={selectionFeedbackItems.find(item => item.id === selectedComponent.selectionFeedback)}
			itemToString={(item: any) => (item ? item.id : '')}
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					selectionFeedback: event.selectedItem.id
				});
			}} />
		<TextInput
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					label: event.currentTarget.value
				});
			}}
		/>
		<Checkbox
			labelText='Hide label'
			id='hide-label'
			checked={selectedComponent.hideLabel}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					hideLabel: checked
				})
			}}
		/>
		<TextInput
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					placeholder: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.helperText}
			labelText='Helper text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					helperText: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.warnText}
			labelText='Warning text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					warnText: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.invalidText}
			labelText='Invalid text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					invalidText: event.currentTarget.value
				});
			}}
		/>
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					light: checked
				})
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ADropdownCodeUI = ({ selectedComponent, setComponent }: any) => {
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
	</>
};

export const ADropdown = ({
	componentObj,
	...rest
}: any) => {
	// Determine which React Component to render based on dropdownType
	let Component = Dropdown;
	if (componentObj.isMulti) {
		Component = MultiSelect;
	}

	return (
		<AComponent
			componentObj={componentObj}
			headingCss={css`display: block;`}
			{...rest}>
			<Component
				id={componentObj.codeContext?.name}
				label={componentObj.placeholder}
				titleText={componentObj.label}
				size={componentObj.size}
				light={componentObj.light}
				disabled={componentObj.disbaled}
				helperText={componentObj.helperText}
				warn={componentObj.warn}
				warnText={componentObj.warnText}
				hideLabel={componentObj.hideLabel}
				invalid={componentObj.invalid}
				invalidText={componentObj.invalidText}
				direction={componentObj.direction}
				items={[]}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};

const determineImports = () => {
	let componentImport = 'Dropdown';
	switch (selectedDropdownType) {
		case 'multiselect':
			componentImport = 'MultiSelect';
			break;
		default:
			componentImport = 'Dropdown';
			break;
	}

	return componentImport;
}

export const componentInfo: ComponentInfo = {
	component: ADropdown,
	styleUI: ADropdownStyleUI,
	codeUI: ADropdownCodeUI,
	keywords: ['dropdown', 'multiselect', 'select'],
	name: 'Dropdown',
	defaultComponentObj: {
		type: 'dropdown',
		isMulti: false,
		selectionFeedback: 'top-after-reopen',
		direction: 'bottom',
		size: 'md',
		label: 'Label',
		titleText: 'Title',
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) =>
				`@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.label}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}HelperText = "${json.helperText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = "${json.light ? 'light' : 'dark'}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Invalid = ${!!json.invalid};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}InvalidText = "${json.invalidText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Size = "${json.size}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Warn = ${!!json.warn};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}WarnText = "${json.warnText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${!!json.disabled};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}DropUp = ${json.direction !== 'bottom'};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}SelectionFeedback = "${json.selectionFeedback}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Type: "single" | "multi" = "${json.isMulti ? "multi" : "single"}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Items = [];`,
			outputs: ({ json }) =>
				`@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter<any>();
				@Output() ${nameStringToVariableString(json.codeContext?.name)}onClose = new EventEmitter<any>();`,
			imports: ['DropdownModule'],
			code: ({ json }) =>
				`<ibm-dropdown
				[label]="${nameStringToVariableString(json.codeContext?.name)}Label"
				[helperText]="${nameStringToVariableString(json.codeContext?.name)}HelperText"
				[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
				[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
				[invalid]="${nameStringToVariableString(json.codeContext?.name)}Invalid"
				[invalidText]="${nameStringToVariableString(json.codeContext?.name)}InvalidText"
				[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
				[warn]="${nameStringToVariableString(json.codeContext?.name)}Warn"
				[warnText]="${nameStringToVariableString(json.codeContext?.name)}WarnText"
				[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
				[dropUp]="${nameStringToVariableString(json.codeContext?.name)}DropUp"
				[selectionFeedback]="${nameStringToVariableString(json.codeContext?.name)}SelectionFeedback"
				[type]="${nameStringToVariableString(json.codeContext?.name)}Type"
				(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit(event)"
				(onClose)="${nameStringToVariableString(json.codeContext?.name)}onClose.emit(event)"
				${angularClassNamesFromComponentObj(json)}>
				<ibm-dropdown-list [items]="${nameStringToVariableString(json.codeContext?.name)}Items"></ibm-dropdown-list>
			</ibm-dropdown>`
		},
		react: {
			imports: [determineImports()],
			code: ({ json }) => {
				// Determine which React Component to render based on dropdownType
				let Component = 'Dropdown';
				if (json.isMulti) {
					Component = 'MultiSelect';
				}
				/**
				 * @todo
				 * Add support for inline, hideLabel
				 */

				//Items are required
				return `<${Component}
					id="${json.codeContext?.name}"
					titleText="${json.label}"
					helperText="${json.helperText}"
					label="${json.placeholder}"
					${json.hideLabel !== undefined ? `hideLabel={${json.hideLabel}}` : ''}
					${json.direction !== 'bottom' ? `direction="${json.direction}"` : ''}
					${json.light ? `light="${json.light}"` : ''}
					${json.size !== 'md' ? `size="${json.size}"` : ''}
					items={state["${json.codeContext?.name}Items"] || []}
					itemToString={state["${json.codeContext?.name}ItemToString"]}
					onChange={(selectedItem) => handleInputChange({
						target: {
							name: "${json.codeContext?.name}",
							value: selectedItem
						}
					})}
					${reactClassNamesFromComponentObj(json)}
				/>`;
			}
		}
	}
};
