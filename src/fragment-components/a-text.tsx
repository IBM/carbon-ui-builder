import React from 'react';
import { AComponent } from './a-component';
import { ComponentInfo } from '.';
import ReactQuill from 'react-quill';
import { Checkbox, TextInput, Toggle } from 'carbon-components-react';
import 'react-quill/dist/quill.snow.css';
import image from './../assets/component-icons/text.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';
import { css } from 'emotion';

export const ATextSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Toggle
			id='useRichTextEditor'
			checked={selectedComponent.useRichTextEditor}
			labelA='Off'
			labelB='On'
			size='sm'
			labelText='Use rich text'
			className={css`margin-bottom: 1rem;`}
			onClick={(event: any) => {
				setComponent({
					...selectedComponent,
					useRichTextEditor: event.currentTarget.checked
				});
			}} />
		{
			selectedComponent.useRichTextEditor
				? <>
					<Checkbox
						labelText='This text is a content section'
						id='use-section'
						checked={selectedComponent.useSectionTag}
						onChange={(checked: boolean) => {
							setComponent({
								...selectedComponent,
								useSectionTag: checked
							});
						}} />
					<ReactQuill
						key={selectedComponent.id}
						theme="snow"
						value={selectedComponent.richText}
						onChange={(event: any) => {
							setComponent({
								...selectedComponent,
								richText: event
							});
						}} />
				</>
				: <TextInput
				value={selectedComponent.text}
				labelText='Text'
				onChange={(event: any) => {
					setComponent({
						...selectedComponent,
						text: event.currentTarget.value
					});
				}} />
		}
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
			{
				componentObj.useRichTextEditor
				? <div dangerouslySetInnerHTML={{ __html: componentObj.richText }} />
				: componentObj.text
			}

	</AText>,
	keywords: ['text'],
	name: 'Text',
	type: 'text',
	defaultComponentObj: {
		type: 'text',
		text: 'Text',
		richText: 'Text',
		useRichTextEditor: false,
		useSectionTag: false
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: [],
			code: ({ json }) => {
				if (json.useRichTextEditor) {
					if (!json.cssClasses.length) {
						return json.richText;
					}
					if (json.useSectionTag) {
						return `<section ${angularClassNamesFromComponentObj(json)}>${json.richText}</section>`;
					}
					return `<div ${angularClassNamesFromComponentObj(json)}>${json.richText}</div>`;
				}
				if (json.cssClasses.length) {
					return `<span ${angularClassNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		},
		react: {
			imports: [],
			code: ({ json }) => {
				if (json.useRichTextEditor) {
					if (!json.cssClasses.length) {
						return json.richText;
					}
					if (json.useSectionTag) {
						return `<section ${reactClassNamesFromComponentObj(json)}>${json.richText}</section>`;
					}
					return `<div ${reactClassNamesFromComponentObj(json)}>${json.richText}</div>`;
				}
				if (json.cssClasses.length) {
					return `<span ${reactClassNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		}
	}
};
