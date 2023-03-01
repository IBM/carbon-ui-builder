import React, { useState } from 'react';
import { AComponent } from './a-component';
import { ComponentInfo } from '.';
import ReactQuill from 'react-quill';
import { Checkbox, TextInput, Toggle } from 'carbon-components-react';
import 'react-quill/dist/quill.snow.css';
import image from './../assets/component-icons/text.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';
import { css } from 'emotion';
import { styleObjectToString } from '../ui-fragment/src/utils';

export const ATextSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const [isRichText, _setIsRichText] = useState(!!selectedComponent.richText);
	const [isSection, _setIsSection] = useState(!!selectedComponent.isSection);
	const [text, _setText] = useState(selectedComponent.text || 'Text');
	const [richText, _setRichText] = useState(selectedComponent.richText || '<p>Some <strong>rich</strong> text </p>');

	const setIsRichText = (is: boolean) => {
		_setIsRichText(is);
		setComponent({
			...selectedComponent,
			isSection: is ? isSection : undefined,
			text: is ? undefined : text,
			richText: is ? richText : undefined
		});
	};

	const setIsSection = (is: boolean) => {
		_setIsSection(is);
		setComponent({
			...selectedComponent,
			isSection: isRichText ? is : undefined
		});
	};

	const setText = (text: string) => {
		setComponent({
			...selectedComponent,
			text
		});
		_setText(text);
	};

	const setRichText = (richText: string) => {
		_setRichText(richText);
		setComponent({
			...selectedComponent,
			richText
		});
	};

	return <>
		<Toggle
			id='useRichText'
			checked={isRichText}
			labelA='Off'
			labelB='On'
			size='sm'
			labelText='Use rich text'
			className={css`margin-bottom: 1rem;`}
			onClick={(event: any) => setIsRichText(event.currentTarget.checked)} />
		{
			isRichText
				? <>
					<Checkbox
						labelText='This text is a content section'
						id='use-section'
						checked={isSection}
						onChange={(checked: boolean) => setIsSection(checked)} />
					<ReactQuill
						key={selectedComponent.id}
						theme='snow'
						value={richText}
						onChange={(event: any) => setRichText(event)} />
				</>
				: <TextInput
					value={text}
					labelText='Text'
					onChange={(event: any) => setText(event.currentTarget.value)} />
		}
	</>;
};

export const ATextCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	labelText='Input name'
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			codeContext: {
				...selectedComponent.codeContext,
				name: event.currentTarget.value
			}
		});
	}} />;

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
	codeUI: ATextCodeUI,
	settingsUI: ATextSettingsUI,
	render: ({ componentObj, select, remove, selected }) => <AText
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{
				componentObj.richText
				? <div className={css`${styleObjectToString(componentObj.style)}`} dangerouslySetInnerHTML={{ __html: componentObj.richText }} />
				: <span className={css`${styleObjectToString(componentObj.style)}`}>{componentObj.text}</span>
			}

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
				if (json.richText) {
					if (json.isSection) {
						return `<section ${angularClassNamesFromComponentObj(json)}>${json.richText}</section>`;
					}
					return `<div ${angularClassNamesFromComponentObj(json)}>${json.richText}</div>`;
				}
				if (json.cssClasses?.length) {
					return `<span ${angularClassNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		},
		react: {
			imports: [],
			code: ({ json }) => {
				if (json.richText) {
					if (json.isSection) {
						return `<section ${reactClassNamesFromComponentObj(json)}>${json.richText}</section>`;
					}
					return `<div ${reactClassNamesFromComponentObj(json)}>${json.richText}</div>`;
				}
				if (json.cssClasses?.length) {
					return `<span ${reactClassNamesFromComponentObj(json)}>${json.text}</span>`;
				}
				return json.text;
			}
		}
	}
};
