import React from 'react';
import {
	TextInput,
	Dropdown,
	Checkbox,
	Search,
	ExpandableSearch
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/search.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { styleObjectToString } from '../ui-fragment/src/utils';

export const ASearchInputSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'lg', text: 'Large' },
		{ id: 'xl', text: 'Extra large' }
	];

	return <>
		<Checkbox
			labelText='Expandable'
			id='expandable'
			checked={selectedComponent.expandable}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				expandable: checked
			})} />
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				disabled: checked
			})} />
		<Checkbox
			labelText='Light'
			id='light'
			checked={selectedComponent.light}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				light: checked
			})} />
		<Checkbox
			labelText='Auto complete'
			id='autocomplete'
			checked={selectedComponent.autocomplete === 'on'}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				autocomplete: checked ? 'on' : 'off'
			})} />
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.inputSize)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				inputSize: event.selectedItem.id
			})} />
		<TextInput
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					label: event.currentTarget.value
				});
			}} />
		<TextInput
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					placeholder: event.currentTarget.value
				});
			}} />
		<TextInput
			value={selectedComponent.defaultValue}
			labelText='Default value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					defaultValue: event.currentTarget.value
				});
			}} />
		<TextInput
			value={selectedComponent.closeButtonLabelText}
			labelText='Close button label text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					closeButtonLabelText: event.currentTarget.value
				});
			}} />
		<TextInput
			value={selectedComponent.searchType}
			labelText='Type'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					searchType: event.currentTarget.value
				});
			}} />
		<TextInput
			value={selectedComponent.role}
			labelText='Role'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					role: event.currentTarget.value
				});
			}} />
	</>;
};

export const ASearchInputCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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
	}} />;

export const ASearchInput = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		rejectDrop={true}
		{...rest}>
			{
				componentObj.expandable
				? <ExpandableSearch
					className={cx(
						componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
						css`${styleObjectToString(componentObj.style)}`
					)}
					size={componentObj.inputSize}
					disabled={componentObj.disabled}
					autoComplete={componentObj.autocomplete}
					placeholder={componentObj.placeholder}
					light={componentObj.light}
					labelText={componentObj.label}
					defaultValue={componentObj.defaultValue}
					closeButtonLabelText={componentObj.closeButtonLabelText}
					id={componentObj.id}
					role={componentObj.role}
					type={componentObj.searchType} />
				: <Search
					size={componentObj.inputSize}
					labelText={componentObj.label}
					placeholder={componentObj.placeholder}
					className={cx(componentObj.cssClasses?.map((cc: any) => cc.id).join(' '), css`${styleObjectToString(componentObj.style)}`)}
					id={componentObj.id}
					autoComplete={componentObj.autocomplete}
					closeButtonLabelText={componentObj.closeButtonLabelText}
					defaultValue={componentObj.defaultValue}
					disabled={componentObj.disabled}
					light={componentObj.light}
					role={componentObj.role}
					type={componentObj.searchType} />
			}
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASearchInput,
	settingsUI: ASearchInputSettingsUI,
	codeUI: ASearchInputCodeUI,
	keywords: ['search', 'search input'],
	name: 'Search',
	type: 'search',
	defaultComponentObj: {
		type: 'search',
		label: 'Search',
		placeholder: 'Search',
		autocomplete: 'off',
		inputSize: 'lg',
		defaultValue: '',
		expandable: false,
		closeButtonLabelText: 'Clear search input',
		disabled: false,
		light: false,
		searchType: 'text',
		role: 'searchbox'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Expandable = ${json.expandable};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Placeholder = "${json.placeholder}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Autocomplete = "${json.autocomplete}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = "${json.light ? 'light' : 'dark'}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Size = "${json.inputSize}";`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter<any>();
				@Output() ${nameStringToVariableString(json.codeContext?.name)}Clear = new EventEmitter<any>();`,
			imports: ['SearchModule'],
			code: ({ json }) => {
				return `<ibm-search
					name="${json.codeContext?.name}"
					[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					[placeholder]="${nameStringToVariableString(json.codeContext?.name)}Placeholder"
					[autocomplete]="${nameStringToVariableString(json.codeContext?.name)}Autocomplete"
					[expandable]="${nameStringToVariableString(json.codeContext?.name)}Expandable"
					[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
					(valueChange)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event)"
					(clear)="${nameStringToVariableString(json.codeContext?.name)}Clear.emit()"
					${angularClassNamesFromComponentObj(json)}>
				</ibm-search>`;
			}
		},
		react: {
			imports: ({ json }) => [json.expandable ? 'ExpandableSearch' : 'Search'],
			code: ({ json }) => {
				if (json.expandable) {
					return `<ExpandableSearch
						value={state["${json.codeContext?.name}"]}
						size="${json.inputSize}"
						disabled={${json.disabled}}
						autoComplete="${json.autocomplete}"
						placeholder="${json.placeholder}"
						light={${json.light}}
						labelText="${json.label}"
						defaultValue="${json.defaultValue}"
						closeButtonLabelText="${json.closeButtonLabelText}"
						id="${json.id}"
						role="${json.role}"
						type="${json.searchType}" />`;
				}
				return `<Search
					${reactClassNamesFromComponentObj(json)}
					value={state["${json.codeContext?.name}"]}
					onChange={handleInputChange}
					size="${json.inputSize}"
					labelText="${json.label}"
					placeholder="${json.placeholder}"
					id="${json.id}"
					autoComplete="${json.autocomplete}"
					closeButtonLabelText="${json.closeButtonLabelText}"
					defaultValue="${json.defaultValue}"
					disabled={${json.disabled}}
					light={${json.light}}
					role="${json.role}"
					type="${json.searchType}" />`;
			}
		}
	}
};
