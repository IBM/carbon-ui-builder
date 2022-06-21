import React, { useCallback, useContext, useEffect, useState } from 'react';

import { css } from 'emotion';
import {
	Modal,
	FormItem,
	FileUploaderDropContainer,
	FileUploaderItem,
	TextArea
} from 'carbon-components-react';
import { FragmentWizardModals } from './fragment-wizard';
import { generateNewFragment } from './generate-new-fragment';

import { GlobalStateContext, NotificationActionType, NotificationContext } from '../../../context';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const fragmentOptions = css`
	margin-left: 30px;
	margin-right: 30px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;

	// This is the viewport width that causes the selection tiles to overlap.
	@media screen and (max-width: 45rem) {
		flex-direction: column;
	}
`;

export interface ImportJsonModalProps {
	shouldDisplay: boolean;
	setShouldDisplay: (shouldDisplay: boolean) => void;
	setDisplayedModal: (displayedModal: FragmentWizardModals | null) => void;
	setLastVisitedModal: (lastVisitedModal: FragmentWizardModals) => void;
	lastVisitedModal: FragmentWizardModals;
	uploadedData: any;
	setUploadedData: (uploadedData: any) => void;
	multiple?: boolean;
}

let lastId = 0;

const uid = (prefix = 'id') => {
	lastId++;
	return `${prefix}${lastId}`;
};

export const ImportJsonModal = (props: ImportJsonModalProps) => {
	const { addFragment } = useContext(GlobalStateContext);
	const [, dispatchNotification] = useContext(NotificationContext);
	const [files, setFiles] = useState([] as any[]);
	const [jsonString, _setJsonString] = useState('');
	const [fragmentJson, setFragmentJson] = useState('');
	const [jsonParseError, setJsonParseError] = useState('');

	const setJsonString = (js: string) => {
		_setJsonString(js);

		try {
			if (js) {
				setFragmentJson(JSON.parse(js));
			}
			setJsonParseError('');
		} catch (e) {
			setJsonParseError((e as any).toString());
		}
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
	};

	const handleDragover = (e: any) => {
		e.preventDefault();
	};

	useEffect(() => {
		document.addEventListener('drop', handleDrop);
		document.addEventListener('dragover', handleDragover);
		return () => {
			document.removeEventListener('drop', handleDrop);
			document.removeEventListener('dragover', handleDragover);
		};
	}, []);

	const navigate: NavigateFunction = useNavigate();
	const uploadFile = async (fileToUpload: any) => {
		// file size validation
		if (fileToUpload.filesize > 512000) {
			const updatedFile = {
				...fileToUpload,
				status: 'edit',
				iconDescription: 'Delete file',
				invalid: true,
				errorSubject: 'File size exceeds limit',
				errorBody: '500kb max file size. Select a new file and try again.'
			};
			setFiles((files) =>
				files.map((file) =>
					file.uuid === fileToUpload.uuid ? updatedFile : file
				)
			);
			return;
		}

		// file type validation
		if (fileToUpload.invalidFileType) {
			const updatedFile = {
				...fileToUpload,
				status: 'edit',
				iconDescription: 'Delete file',
				invalid: true,
				errorSubject: 'Invalid file type',
				errorBody: `"${fileToUpload.name}" does not have a valid file type.`
			};
			setFiles((files) =>
				files.map((file) =>
					file.uuid === fileToUpload.uuid ? updatedFile : file
				)
			);
			return;
		}

		// reading
		const reader = new FileReader();
		reader.readAsText(fileToUpload.file, 'UTF-8');
		reader.onload = (event) => {
			setJsonString(event.target?.result as string);
		};
		reader.onerror = function (_) {
			console.log('oops');
		};

		const updatedFile = {
			...fileToUpload,
			status: 'complete',
			iconDescription: 'Upload complete'
		};
		setFiles((files) =>
			files.map((file) =>
				file.uuid === fileToUpload.uuid ? updatedFile : file
			)
		);

		// show x icon after 1 second
		setTimeout(() => {
			const updatedFile = {
				...fileToUpload,
				status: 'edit',
				iconDescription: 'Delete file'
			};
			setFiles((files) =>
				files.map((file) =>
					file.uuid === fileToUpload.uuid ? updatedFile : file
				)
			);
		}, 1000);
	};

	const onAddFiles = useCallback(
		(evt, { addedFiles }) => {
			evt.stopPropagation();
			const newFiles = addedFiles.map((file: any) => ({
				uuid: uid(),
				file: file,
				name: file.name,
				filesize: file.size,
				status: 'uploading',
				iconDescription: 'Uploading',
				invalidFileType: file.invalidFileType
			}));
			// eslint-disable-next-line react/prop-types
			if (props.multiple) {
				setFiles([...files, ...newFiles]);
				newFiles.forEach(uploadFile);
			} else if (newFiles[0]) {
				setFiles([newFiles[0]]);
				uploadFile(newFiles[0]);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[files, props.multiple]
	);

	const handleFileUploaderItemClick = useCallback(
		(_, { uuid: clickedUuid }) =>
			setFiles(files.filter(({ uuid }) => clickedUuid !== uuid)),
		[files]
	);

	const generateFragment = () => {
		const generatedFragment = generateNewFragment(fragmentJson);

		// close all notifications
		dispatchNotification({
			type: NotificationActionType.CLOSE_ALL_NOTIFICATIONS
		});

		addFragment(generatedFragment);

		// go to new fragment
		navigate(`/edit/${generatedFragment.id}`);
	};

	return (
		<Modal
			open={props.shouldDisplay}
			shouldSubmitOnEnter={false}
			selectorPrimaryFocus='.bx--tile--selectable'
			onRequestSubmit={() => {
				generateFragment();
				props.setLastVisitedModal(FragmentWizardModals.CHOOSE_FRAGMENT_MODAL);
			}}
			onRequestClose={() => props.setShouldDisplay(false)}
			onSecondarySubmit={() => {
				props.setDisplayedModal(props.lastVisitedModal);
				props.setLastVisitedModal(FragmentWizardModals.CHOOSE_FRAGMENT_MODAL);
			}}
			hasForm
			modalHeading='Import JSON'
			primaryButtonText='Done'
			primaryButtonDisabled={!jsonString || jsonParseError}
			secondaryButtonText='Back'>
			<div className={fragmentOptions}>
				<FormItem>
					<p className='bx--file--label'>Upload file</p>
					<p className='bx--label-description'>
						Max file size is 500kb. Supported file type is .json
					</p>
					<FileUploaderDropContainer accept={['.json']} onAddFiles={onAddFiles} />
					<div className={'bx--file-container'} style={{ width: '100%' }}>
						{files.map(
							({
								uuid,
								name,
								filesize,
								status,
								iconDescription,
								invalid,
								...rest
							}) => (
								<FileUploaderItem
									key={uid()}
									{...rest}
									uuid={uuid}
									name={name}
									filesize={filesize}
									// eslint-disable-next-line react/prop-types
									size={500}
									status={status}
									iconDescription={iconDescription}
									invalid={invalid}
									onDelete={handleFileUploaderItemClick}
								/>
							)
						)}
					</div>
				</FormItem>
				<code style={{ color: '#a00', marginBottom: '10pt', width: '100%' }}>
					<pre>{jsonParseError}</pre>
				</code>
				<TextArea
					labelText='JSON to load'
					placeholder="{'your': 'json', 'goes': 'here'}"
					helperText=''
					value={jsonString}
					onChange={(event: any) => setJsonString(event.target.value)}
				/>
			</div>
		</Modal>
	);
};
