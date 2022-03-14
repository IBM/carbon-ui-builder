import React from 'react';
import { Link, Checkbox, TextInput } from 'carbon-components-react';
import { css } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';

import image from './../assets/component-icons/link.svg';
import { angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ALinkStyleUI = ({selectedComponent, setComponent}: any) => {
	return <>
		<TextInput
			value={selectedComponent.text}
			labelText='Text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					text: event.currentTarget.value
				});
			}}
		/>
		<Checkbox
			labelText='Disabled'
			id='disable-label'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}}
		/>
		<Checkbox
			labelText='Inline'
			id='Inline-select'
			checked={selectedComponent.inline}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					inline: checked
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ALinkCodeUI = ({selectedComponent, setComponent}: any) => {
	return <>
		<TextInput
			value={selectedComponent.codeContext?.href || ''}
			labelText='href'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						href: event.currentTarget.value
					}
				});
			}}
		/>
	</>
};

export const ALink = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		className={css`align-items: center; justify-content: center; display: inline-flex`}
		{...rest}>
			<Link
			inline={componentObj.inline}
			disabled={componentObj.disabled}
			href={componentObj.codeContext?.href}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{children}
			</Link>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ALink,
	styleUI: ALinkStyleUI,
	codeUI: ALinkCodeUI,
	render: ({ componentObj, select, remove, selected }) => <ALink
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.text}
	</ALink>,
	keywords: ['link'],
	name: 'Link',
	defaultComponentObj: {
		type: 'link',
		text: 'Link',
		inline: false,
		disabled: false
	},
	image,
	codeExport: {
		angular: {
			inputs: ({json}) => `
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Inline = ${json.inline}'
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Href = '${json.href}'`,
			outputs: ({json}) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
			imports: ['LinkModule'],
			code: ({json, jsonToTemplate }) => {
				return `<a
				[inline]="${nameStringToVariableString(json.codeContext?.name)}Inline"
				[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
				[href]=${nameStringToVariableString(json.codeContext?.name)}Href
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</a>`;
			}
		},
		react: {
			imports: ['Link'],
			code: ({ json,  jsonToTemplate }) => {
				return `<Link
				${json.disabled !== undefined && json.disabled !== '' ? `disabled="${json.disabled}"` : ''}
				${json.inline !== undefined && json.inline !== '' ? `inline="${json.inline}"` : ''}
				${json.codeContext?.href !== undefined && json.codeContext?.href !== '' ? `href='${json.codeContext?.href}'` : ''}
				${reactClassNamesFromComponentObj(json)}>
					${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</Link>`;
			}
		}
	}
};
