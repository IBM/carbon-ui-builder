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
			onChange={(checked: any) => {
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
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					inline: checked
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
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
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{children}
			</Link>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ALink,
	styleUI: ALinkStyleUI,
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
		text: 'Link'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({json}) => `
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Inline = ${json.inline};
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};`,
			outputs: ({json}) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
			imports: ['LinkModule'],
			code: ({json}) => {
				return `<a
				[inline]="${nameStringToVariableString(json.codeContext?.name)}Inline"
				[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					${angularClassNamesFromComponentObj(json)}>
						${json.text}
				</a>`;
			}
		},
		react: {
			imports: ['Link'],
			code: ({ json }) => {
				return `<Link
				${json.disabled !== undefined && json.disabled !== '' ? `disabled="${json.disabled}"` : ''}
				${json.inline !== undefined && json.inline !== '' ? `inline="${json.inline}"` : ''}
				${reactClassNamesFromComponentObj(json)}>
					${json.text}
				</Link>`;
			}
		}
	}
};
