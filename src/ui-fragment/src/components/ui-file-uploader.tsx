import React from 'react';
import {
	FileUploader,
	FileUploaderDropContainer
 } from 'carbon-components-react';
 import { css, cx } from 'emotion';
import { CssClasses } from '../types';

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

export interface FileUploaderState {
	type: string;
	cssClasses?: CssClasses[];
	buttonKind: string;
	buttonLabel: string;
	labelTitle: string;
	filenameStatus: string;
	dragAndDroplabelText: string;
	labelDescription: string;
	iconDescription: string;
	size: string;
	multiple: boolean;
	disabled: boolean;
	dragAndDrop: boolean;
	codeContext?: {
		name: string;
	};
}

export const UIFileUploader = ({ state }: {
	state: FileUploaderState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'file-uploader') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <>
	{
		state.dragAndDrop
			? <>
		<strong className={labelTitleStyle}>{state.labelTitle}</strong>
		<p className={labelDescriptionStyle}>
			{state.labelDescription}
		</p>
		<FileUploaderDropContainer
		accept={[
		'image/jpeg',
		'image/png'
		]}
		multiple={state.multiple}
		disabled={state.disabled}
		labelText={state.dragAndDroplabelText}
		tabIndex={0} />
			</> :
		<FileUploader
		accept={[
			'.jpg',
			'.png'
		]}
		buttonKind={state.buttonKind}
		buttonLabel={state.buttonLabel}
		filenameStatus={state.filenameStatus}
		iconDescription={state.iconDescription}
		labelDescription={state.labelDescription}
		labelTitle={state.labelTitle}
		multiple={state.multiple}
		disabled={state.disabled}
		size={state.size} />
	};
	</>
};
