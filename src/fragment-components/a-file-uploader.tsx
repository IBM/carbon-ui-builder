import React from 'react';
import {
	FileUploader,
	FileUploaderDropContainer,
	TextInput,
	Checkbox,
	Dropdown
} from 'carbon-components-react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/file-uploader.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

const labelDescriptionStyle = css`
    color: #525252;
    font-size: .875rem;
    font-weight: 400;
    letter-spacing: .16px;
	line-height: 1.28572;
	margin-top: 0.5rem;
    margin-bottom: 1rem;
`;

const labelTitleStyle = css`
    color: #161616;
    font-size: .875rem;
    font-weight: 600;
    letter-spacing: .16px;
    line-height: 1.28572;
`;

export const AFileUploaderSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const buttonKind = [
		{ id: 'primary', text: 'Primary' },
		{ id: 'secondary', text: 'Secondary' },
		{ id: 'danger', text: 'Danger' },
		{ id: 'ghost', text: 'Ghost' },
		{ id: 'danger--primary', text: 'Danger primary' },
		{ id: 'tertiary', text: 'Tertiary' }
	];

	const size = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	const filenameStatus = [
		{ id: 'edit', text: 'Edit' },
		{ id: 'uploading', text: 'Uploading' },
		{ id: 'complete', text: 'Complete' }
	];

	return <>
		<Checkbox
			labelText='Multiple'
			id='multiple'
			checked={selectedComponent.multiple}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					multiple: checked
				});
			}} />

		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}} />

		<Checkbox
			labelText='Drag and drop'
			id='DragAndDrop'
			checked={selectedComponent.dragAndDrop}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					dragAndDrop: checked
				});
			}} />

		<Dropdown
			id='filenameStatus'
			label='File name status'
			titleText='File name status'
			items={filenameStatus}
			selectedItem={filenameStatus.find(item => item.id === selectedComponent.filenameStatus)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				filenameStatus: event.selectedItem.id
			})} />

		{
			selectedComponent.dragAndDrop
				?
			<TextInput
				value={selectedComponent.dragAndDroplabelText}
				labelText='Drag and drop label text'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					dragAndDroplabelText: event.currentTarget.value
				})} />
				: <>
			<Dropdown
				id='size'
				label='Size'
				titleText='Size'
				items={size}
				selectedItem={size.find(item => item.id === selectedComponent.size)}
				itemToString={(item: any) => (item ? item.text : '')}
				onChange={(event: any) => setComponent({
					...selectedComponent,
					size: event.selectedItem.id
				})} />

			<Dropdown
				id='button-kind'
				label='Button kind'
				titleText='Button kind'
				items={buttonKind}
				selectedItem={buttonKind.find(item => item.id === selectedComponent.buttonKind)}
				itemToString={(item: any) => (item ? item.text : '')}
				onChange={(event: any) => setComponent({
					...selectedComponent,
					buttonKind: event.selectedItem.id
				})} />

			<TextInput
				value={selectedComponent.buttonLabel}
				labelText='Button label'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					buttonLabel: event.currentTarget.value
				})} />

			<TextInput
				value={selectedComponent.iconDescription}
				labelText='Icon description'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					iconDescription: event.currentTarget.value
				})} />
				</>
		}

		<TextInput
			value={selectedComponent.labelTitle}
			labelText='Label title'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				labelTitle: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.labelDescription}
			labelText='Label description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				labelDescription: event.currentTarget.value
			})} />
	</>;
};

export const AFileUploaderCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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
	}}
/>;

export const AFileUploader = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			{
				componentObj.dragAndDrop
					? <>
				<strong className={labelTitleStyle}>{componentObj.labelTitle}</strong>
				<p className={labelDescriptionStyle}>
					{componentObj.labelDescription}
				</p>
				<FileUploaderDropContainer
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				accept={[
				'image/jpeg',
				'image/png'
				]}
				multiple={componentObj.multiple}
				disabled={componentObj.disabled}
				labelText={componentObj.dragAndDroplabelText}
				tabIndex={0} />
					</> :
				<FileUploader
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				accept={[
					'.jpg',
					'.png'
				]}
				buttonKind={componentObj.buttonKind}
				buttonLabel={componentObj.buttonLabel}
				filenameStatus={componentObj.filenameStatus}
				iconDescription={componentObj.iconDescription}
				labelDescription={componentObj.labelDescription}
				labelTitle={componentObj.labelTitle}
				multiple={componentObj.multiple}
				disabled={componentObj.disabled}
				size={componentObj.size} />
			}
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AFileUploader,
	settingsUI: AFileUploaderSettingsUI,
	codeUI: AFileUploaderCodeUI,
	render: ({ componentObj, select, remove, selected }) => <AFileUploader
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
	</AFileUploader>,
	keywords: ['file', 'uploader'],
	name: 'File uploader',
	type: 'file-uploader',
	defaultComponentObj: {
		type: 'file-uploader',
		buttonKind: 'primary',
		buttonLabel: 'Add files',
		labelTitle: 'Upload files',
		filenameStatus: 'uploading',
		dragAndDroplabelText: 'Drag and drop files here or click to upload',
		labelDescription: '',
		iconDescription: '',
		size: 'md',
		multiple: false,
		disabled: false,
		dragAndDrop: false

	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => '',
			outputs: ({ json }) => '',
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		},
		react: {
			imports: ['FileUploader', 'FileUploaderDropContainer'],
			code: ({ json }) => {
				return ``;
			}
		}
	}
};