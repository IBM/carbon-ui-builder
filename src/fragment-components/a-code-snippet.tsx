import React from 'react';
import { Dropdown, TextInput, CodeSnippet } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentInfo } from '.';
import Editor from '@monaco-editor/react';
import image from './../assets/component-icons/code-snippet.svg';
import { nameStringToVariableString } from '../utils/fragment-tools';

export const ACodeSnippetSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const variantItems = [
		{ id: 'single', text: 'Single line' },
		{ id: 'multi', text: 'Multi line' },
		{ id: 'inline', text: 'Inline' }
	];
	const languages = [
		{ id: 'json', text: 'JSON' },
		{ id: 'html', text: 'HTML' },
		{ id: 'css', text: 'CSS' },
		{ id: 'javascript', text: 'Javascript' }
	];
	return <>
		<Dropdown
			label='Code language selector'
			titleText='Code language selector'
			items={languages}
			initialSelectedItem={languages.find(item => item.id === selectedComponent.language)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				language: event.selectedItem.id
		})}/>
		<label className="bx--label">Code</label>
		<Editor
			language={selectedComponent.language} height="25vh"
			value={selectedComponent.code}
			onChange={(event: any) => {
				setComponent({
				...selectedComponent,
				code: event
			})}}
		></Editor>
		<Dropdown
			label='Variant selector'
			titleText='Variant selector'
			items={variantItems}
			initialSelectedItem={variantItems.find(item => item.id === selectedComponent.varient)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				varient: event.selectedItem.id
		})}/>
	</>;
};

export const ACodeSnippetCodeUI = ({ selectedComponent, setComponent }: any) => {
	return (
		<TextInput
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						name: event.currentTarget.value
					}
				});
			}}
		/>
	);
};

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
			type={componentObj.varient}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
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
	name: 'Code Snippet',
	type: 'code-snippet',
	defaultComponentObj: {
		type: 'code-snippet',
		label: 'CodeSnippet',
		varient: 'single',
		code: '',
		language: 'html'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Type = "${json.varient}"
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Code = ${JSON.stringify(json.code)}`,
			outputs: () => '',
			imports: ['CodeSnippetModule'],
			code: ({ json }) => {
				return `<ibm-code-snippet
					display={{${nameStringToVariableString(json.codeContext?.name)}Type}}>
						{{${nameStringToVariableString(json.codeContext?.name)}Code}}
					</ibm-code-snippet>`;
			}
		},
		react: {
			imports: ['CodeSnippet'],
			code: ({ json }) => {
				return `<CodeSnippet
					type="${json.varient}">
						{${JSON.stringify(json.code)}}
					</CodeSnippet>`;
			}
		}
	}
};
