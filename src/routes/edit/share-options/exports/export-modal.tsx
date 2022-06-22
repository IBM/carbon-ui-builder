import React, { useContext, useState } from 'react';

import {
	Button,
	Modal,
	Tab,
	Tabs
} from 'carbon-components-react';
import { Copy16, Document16 } from '@carbon/icons-react';
import { css } from 'emotion';
import Editor from '@monaco-editor/react';

import { createFragmentSandbox } from './create-fragment-sandbox';
import { createReactApp } from './frameworks/react-fragment';
import { createAngularApp } from './frameworks/angular-fragment';

import { ModalContext, ModalActionType } from '../../../../context/modal-context';
import { saveBlob } from '../../../../utils/file-tools';
import { GlobalStateContext } from '../../../../context';
import { ExportImageComponent } from './export-image-component';

const exportCodeModalStyle = css`
	.bx--tab-content {
		height: calc(100% - 40px);
		overflow: hidden;
	}
`;

const titleWrapper = css`
    display: flex;
    a, button {
        margin-left: auto;
    }
`;

const tabContentStyle = css`
	display: grid;
	grid-template-columns: 1fr 8fr;
	margin-top: 20px;
`;

const contentHeight = 'calc(100vh - 257px)';

const codeSnippetWrapperStyle = css`
	height: ${contentHeight};

    p {
        line-height: 2rem;
    }
`;

const fileNamesContainerStyle = css`
	display: inline-block;
	min-width: 240px;
	overflow-y: auto;
	height: ${contentHeight};
`;

const fileNameStyle = css`
	display: block;
	width: 100%;

	&.bx--btn--ghost.bx--btn--sm {
		padding-left: 2rem;
	}

	svg.bx--btn__icon {
		position: absolute;
		top: 7px;
		left: 0;
	}
`;

const filenameToLanguage = (filename: string) => {
	const filenameLowercase = filename.toLowerCase();

	if (
		filenameLowercase.endsWith('ts') ||
		filenameLowercase.endsWith('tsx')
	) {
		return 'typescript';
	}

	if (
		filenameLowercase.endsWith('js') ||
		filenameLowercase.endsWith('jsx')
	) {
		return 'javascript';
	}

	if (
		filenameLowercase.endsWith('css') ||
		filenameLowercase.endsWith('scss')
	) {
		return 'scss';
	}

	if (
		filenameLowercase.endsWith('json')
	) {
		return 'json';
	}

	if (
		filenameLowercase.endsWith('html')
	) {
		return 'html';
	}

	return 'text';
};

const FileNames = ({ code, setSelectedFilename }: any) => <div className={fileNamesContainerStyle}>
	{
		Object.keys(code).map((fileName: string) => (
			<Button
			key={fileName}
			className={fileNameStyle}
			kind='ghost'
			renderIcon={Document16}
			size='sm'
			onClick={() => setSelectedFilename(fileName)}>
				{fileName}
			</Button>
		))
	}
</div>;

const copyToClipboard = (codeString: string) => {
	navigator.clipboard.writeText(codeString);
};

const CodeView = ({ code, selectedFilename }: any) => {
	const codeString = selectedFilename !== 'package.json'
		? code[selectedFilename]
		: JSON.stringify(code[selectedFilename], null, '\t');

	return <div className={codeSnippetWrapperStyle}>
		<p>
			{selectedFilename}
			<Button
				kind='ghost'
				size='sm'
				hasIconOnly
				iconDescription='Copy to clipboard'
				onClick={() => copyToClipboard(codeString)}
				renderIcon={Copy16}/>
		</p>
		<Editor
			height='calc(100% - 32px)'
			language={filenameToLanguage(selectedFilename)}
			value={codeString}
		/>
	</div>;
};

const generateSandboxUrl = (parameters: any) => (`https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`);

export const ExportModal = ({ fragment }: any) => {
	const { fragments, settings, setSettings } = useContext(GlobalStateContext);
	const [modalState, dispatchModal] = useContext(ModalContext);
	const [selectedAngularFilename, setSelectedAngularFilename] = useState('src/app/app.component.ts' as string);
	const [selectedReactFilename, setSelectedReactFilename] = useState('src/component.js' as string);

	const jsonCode: any = JSON.stringify(fragment.data, null, 2);
	const reactCode: any = createReactApp(fragment, fragments);
	const angularCode: any = createAngularApp(fragment, fragments);

	return (
		<Modal
		passiveModal
		open={modalState.ShowModal}
		onRequestClose={() => dispatchModal({ type: ModalActionType.closeModal })}
		size='lg'
		modalHeading={`Export "${fragment.title}" code`}
		className={exportCodeModalStyle}>
			<Tabs
			selected={settings.selectedExportTabIndex || 0}
			onSelectionChange={(tabIndex: number) => {
				setSettings({ ...settings, selectedExportTabIndex: tabIndex });
			}}>
				<Tab
				id='Angular'
				label='Angular'
				role='presentation'
				tabIndex={0}>
					<div className={titleWrapper}>
						<h3>Angular Code</h3>
						<a
							href={generateSandboxUrl(createFragmentSandbox(angularCode))}
							target='_blank'
							rel='noopener noreferrer'>
								Edit on CodeSandbox
						</a>
					</div>
					<div className={tabContentStyle}>
						<FileNames code={angularCode} setSelectedFilename={setSelectedAngularFilename} />
						<CodeView code={angularCode} selectedFilename={selectedAngularFilename} />
					</div>
				</Tab>
				<Tab
				id='react'
				label='React'
				role='presentation'
				tabIndex={0}>
					<div className={titleWrapper}>
						<h3>React Code</h3>
						<a
							href={generateSandboxUrl(createFragmentSandbox(reactCode))}
							target='_blank'
							rel='noopener noreferrer'>
								Edit on CodeSandbox
						</a>
					</div>
					<div className={tabContentStyle}>
						<FileNames code={reactCode} setSelectedFilename={setSelectedReactFilename} />
						<CodeView code={reactCode} selectedFilename={selectedReactFilename} />
					</div>
				</Tab>
				<Tab
				id='json'
				label='JSON'
				role='presentation'
				tabIndex={0}>
					<div className={titleWrapper}>
						<h3>
							JSON
							<Button
								kind='ghost'
								className={css`margin-top: -6px;`}
								hasIconOnly
								iconDescription='Copy to clipboard'
								onClick={() => copyToClipboard(jsonCode)}
								renderIcon={Copy16}/>
						</h3>
						<Button
						kind='ghost'
						onClick={() => saveBlob(new Blob([jsonCode]), `${fragment.title}.json`)}>
							Download JSON
						</Button>
					</div>
					<Editor
						height={contentHeight}
						language='json'
						value={jsonCode}
					/>
				</Tab>
				<Tab
				id='image'
				label='Image'
				role='presentation'
				tabIndex={0}>
					<div className={titleWrapper}>
						<h3>Image</h3>
					</div>
					<ExportImageComponent fragment={fragment} />
				</Tab>
			</Tabs>
		</Modal>
	);
};
