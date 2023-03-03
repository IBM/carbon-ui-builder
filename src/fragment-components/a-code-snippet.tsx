import React, { useState } from 'react';
import {
	Dropdown,
	TextInput,
	CodeSnippet,
	Checkbox
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentInfo } from '.';
import Editor from '@monaco-editor/react';
import image from './../assets/component-icons/code-snippet.svg';
import { nameStringToVariableString } from '../utils/fragment-tools';
import { styleObjectToString } from '../ui-fragment/src/utils';

export const ACodeSnippetSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const variantItems = [
		{ id: 'single', text: 'Single line' },
		{ id: 'multi', text: 'Multi line' },
		{ id: 'inline', text: 'Inline' }
	];
	const languages = [
		{ id: 'text', text: 'Text' },
		{ id: 'json', text: 'JSON' },
		{ id: 'html', text: 'HTML' },
		{ id: 'css', text: 'CSS' },
		{ id: 'javascript', text: 'JavaScript' },
		{ id: 'typescript', text: 'TypeScript' }
	];

	const [codeLanguage, setCodeLanguage] = useState('text');

	return <>
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => setComponent({
				...selectedComponent,
				light: checked
		})} />

		<Dropdown
			label='Code language selector'
			titleText='Code language selector'
			size='sm'
			items={languages}
			selectedItem={languages.find(item => item.id === codeLanguage)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setCodeLanguage(event.selectedItem.id)} />

		<label className='bx--label'>Code</label>
		<Editor
			language={codeLanguage} height="10rem"
			value={selectedComponent.code}
			options= {{ quickSuggestions: false }}
			onChange= {(value: any) => {
				setComponent({
				...selectedComponent,
				code: value
			});
		}} />

		<Dropdown
			label='Variant selector'
			titleText='Variant selector'
			items={variantItems}
			initialSelectedItem={variantItems.find(item => item.id === selectedComponent.variant)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				variant: event.selectedItem.id
			})} />
	</>;
};

export const ACodeSnippetCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	labelText='Input name'
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			codeContext: {
				name: event.currentTarget.value
			}
		});
	}} />;

export const ACodeSnippet = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		rejectDrop={true}
		{...rest}>
			<CodeSnippet
			light={componentObj.light}
			type={componentObj.variant}
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				css`${styleObjectToString(componentObj.style)}`
			)}>
				{componentObj.code}
			</CodeSnippet>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ACodeSnippet,
	settingsUI: ACodeSnippetSettingsUI,
	codeUI: ACodeSnippetCodeUI,
	keywords: ['code', 'snippet', 'code snippet'],
	name: 'Code snippet',
	type: 'code-snippet',
	defaultComponentObj: {
		type: 'code-snippet',
		variant: 'single',
		code: ''
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Type = "${json.variant}"
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = "${json.light ? 'light' : 'dark'}"
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Code = \`${json.code}\``,
			outputs: () => '',
			imports: ['CodeSnippetModule'],
			code: ({ json }) => {
				return `<ibm-code-snippet
					[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
					display={{${nameStringToVariableString(json.codeContext?.name)}Type}}>{{
						${nameStringToVariableString(json.codeContext?.name)}Code
					}}</ibm-code-snippet>`;
			}
		},
		react: {
			imports: ['CodeSnippet'],
			code: ({ json }) => {
				return `<CodeSnippet
					light={${!!json.light}}
					type="${json.variant}">{\`${json.code}\`}
				</CodeSnippet>`;
			}
		}
	}
};
