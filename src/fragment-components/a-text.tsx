import React from 'react';
import { TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/text.svg';
import { classNamesFromComponentObj } from '../utils/fragment-tools';

export const ATextStyleUI = ({selectedComponent, setComponent}: any) => {
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
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const AText = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
		{...rest}>
			{children}
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AText,
	styleUI: ATextStyleUI,
	render: ({componentObj, select, remove, selected}) => <AText
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.text}
	</AText>,
	keywords: ['text'],
	name: 'Text',
	defaultComponentObj: {
		type: 'text',
		text: 'Text'
	},
	image,
	codeExport: {
		react: {
			imports: [],
			code: ({json}) => {
				if (json.cssClasses) {
					return `<span ${classNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		}
	}
};
