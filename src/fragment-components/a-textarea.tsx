import React from 'react';
import { TextArea, TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/text-area.svg';

export const ATextAreaStyleUI = ({selectedComponent, setComponent}: any) => {
	return <>
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
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					placeholder: event.currentTarget.value
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};


export const ATextAreaCodeUI = ({selectedComponent, setComponent}: any) => {
	return <>
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
	</>
};

export const ATextArea = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent componentObj={componentObj} {...rest}>
			<TextArea
				kind={componentObj.kind}
				disabled={componentObj.disabled}
				labelText={componentObj.label}
				placeholder={componentObj.placeholder}
				helperText={componentObj.helperText}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATextArea,
	styleUI: ATextAreaStyleUI,
	codeUI: ATextAreaCodeUI,
	keywords: ['textarea', 'text area', 'input'],
	name: 'Text area',
	defaultComponentObj: {
		type: 'textarea',
		label: 'Text area label',
		placeholder: 'Text area placeholder',
		helperText: 'Helper text'
	},
	image
};
