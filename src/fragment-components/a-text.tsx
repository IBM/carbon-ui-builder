import React from 'react';
import { TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/text.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ATextSettingsUI = ({ selectedComponent, setComponent }: any) => {
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
	</>;
};

export const AText = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
		{...rest}>
			{children}
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AText,
	settingsUI: ATextSettingsUI,
	render: ({ componentObj, select, remove, selected }) => <AText
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.text}
	</AText>,
	keywords: ['text'],
	name: 'Text',
	type: 'text',
	defaultComponentObj: {
		type: 'text',
		text: 'Text'
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: [],
			code: ({ json }) => {
				if (json.cssClasses) {
					return `<span ${angularClassNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		},
		react: {
			imports: [],
			code: ({ json }) => {
				if (json.cssClasses) {
					return `<span ${reactClassNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		}
	}
};
