import React from 'react';
import {
	Checkbox,
	Dropdown,
	Tag,
	TextInput
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { css, cx } from 'emotion';
import image from './../assets/component-icons/tag.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { styleObjectToString } from '../ui-fragment/src/utils';

export const ATagSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const typeItems = [
		{ id: 'gray', text: 'Gray' },
		{ id: 'red', text: 'Red' },
		{ id: 'magenta', text: 'Magenta' },
		{ id: 'purple', text: 'Purple' },
		{ id: 'blue', text: 'Blue' },
		{ id: 'cyan', text: 'Cyan' },
		{ id: 'teal', text: 'Teal' },
		{ id: 'green', text: 'Green' },
		{ id: 'cool-gray', text: 'Cool gray' },
		{ id: 'warm-gray', text: 'Warm gray' },
		{ id: 'high-contrast', text: 'High contrast' },
		{ id: 'outline', text: 'Outline' }
	];

	const sizeItems = [
		{ id: 'md', text: 'Medium' },
		{ id: 'sm', text: 'Small' }
	];

	return <>
		<TextInput
			value={selectedComponent.title}
			labelText='Title'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					title: event.currentTarget.value
				});
			}}
		/>

		<Dropdown
			label='Type'
			titleText='Type'
			items={typeItems}
			selectedItem={typeItems.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				kind: event.selectedItem.id
			})}
		/>

		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})}
		/>

		<TextInput
			value={selectedComponent.closeLabel}
			labelText='Close filter label'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					closeLabel: event.currentTarget.value
				});
			}}
		/>

		<Checkbox
			labelText='Is filter'
			id='filter'
			checked={selectedComponent.filter}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					filter: checked
				});
			}}
		/>

		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}}
		/>
	</>;
};

export const ATagCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ATag = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Tag
			type={componentObj.kind}
			disabled={componentObj.disabled}
			size={componentObj.size}
			filter={componentObj.filter}
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				css`${styleObjectToString(componentObj.style)}`
			)}>
				{children}
			</Tag>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATag,
	codeUI: ATagCodeUI,
	settingsUI: ATagSettingsUI,
	render: ({ componentObj, select, remove, selected }) => <ATag
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.title}
	</ATag>,
	keywords: ['tag'],
	name: 'Tag',
	type: 'tag',
	defaultComponentObj: {
		type: 'tag',
		// This field is `type` in the `Tag` component
		kind: 'gray',
		size: 'md',
		filter: false,
		disabled: false,
		title: 'Tag'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Title = "${json.title}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Type = "${json.kind}";`,
			outputs: ({ json }) => `${json.filter
				? `@Output() ${nameStringToVariableString(json.codeContext?.name)}Click = new EventEmitter();
					@Output() ${nameStringToVariableString(json.codeContext?.name)}Close = new EventEmitter();`
				: ''
			}`,
			imports: ['TagModule'],
			code: ({ json }) => {
				const defaultProps = `
					[type]="${nameStringToVariableString(json.codeContext?.name)}Type"
					[title]="${nameStringToVariableString(json.codeContext?.name)}Title"
					${`size='${json.size ? json.size : 'md'}'`}
				`;
				if (json.filter) {
					return `<ibm-tag-filter
						${defaultProps}
						(click)='${nameStringToVariableString(json.codeContext?.name)}Click.emit()'
						(close)='${nameStringToVariableString(json.codeContext?.name)}Close.emit()'
						${angularClassNamesFromComponentObj(json)}
						[disabled]='${json.disabled}'
						${json.closeLabel ? `closeButtonLabel='${json.closeLabel}'` : ''}>
							${json.title}
					</ibm-tag-filter>
					`;
				}

				return `<ibm-tag
					${defaultProps}
					${angularClassNamesFromComponentObj(json)}>
						${json.title}
				</ibm-tag>`;
			}
		},
		react: {
			imports: ['Tag'],
			code: ({ json }) => {
				return `<Tag
					${json.kind && ` type="${json.kind}"`}
					${`size='${json.size ? json.size : 'md'}'`}
					${json.closeLabel && `title="${json.closeLabel}"`}
					disabled={${json.disabled}}
					filter={${json.filter}}
					${reactClassNamesFromComponentObj(json)}>
						${json.title}
				</Tag>`;
			}
		}
	}
};
