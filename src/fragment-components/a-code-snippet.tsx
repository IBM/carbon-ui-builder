import React from 'react';
import { Dropdown, TextArea, TextInput, CodeSnippet } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/checkbox.svg';
import { nameStringToVariableString } from '../utils/fragment-tools';

export const ACodeSnippetSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const variantItems = [
		{ id: 'single', text: 'Single line' },
		{ id: 'multi', text: 'Multi line' },
		{ id: 'inline', text: 'Inline' }
	];
	return <>
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
		<TextArea
			value={selectedComponent.code}
			labelText='Code'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				code: event.currentTarget.value
		})} />
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
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
	name: 'CodeSnippet',
	type: 'code-snippet',
	defaultComponentObj: {
		type: 'code-snippet',
		label: 'CodeSnippet',
		varient: 'single',
		code: ''
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Type = "${json.varient}"`,
			outputs: () => '',
			imports: ['CodeSnippetModule, ButtonModule'],
			code: ({ json }) => {
				return `<ibm-code-snippet
					display={{${nameStringToVariableString(json.codeContext?.name)}Type}} >
						${json.code}
					</ibm-code-snippet>`;
			}
		},
		react: {
			imports: ['CodeSnippet'],
			code: ({ json }) => {
				return `<CodeSnippet
					type="${json.varient}">
						${json.code}
					</CodeSnippet>`;
			}
		}
	}
};
