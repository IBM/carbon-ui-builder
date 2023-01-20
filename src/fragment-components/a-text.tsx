import React from 'react';
import { AComponent } from './a-component';
import { ComponentInfo } from '.';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import image from './../assets/component-icons/text.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ATextSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <ReactQuill
			key={selectedComponent.id}
			theme="snow"
			value={selectedComponent.text}
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					text: event
			});
		}} />
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
			<div dangerouslySetInnerHTML={{ __html: componentObj.text }} />

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
				if (json.cssClasses.length) {
					return `<span ${angularClassNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		},
		react: {
			imports: [],
			code: ({ json }) => {
				if (json.cssClasses.length) {
					return `<span ${reactClassNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		}
	}
};
