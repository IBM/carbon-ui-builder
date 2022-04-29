import React, { useContext } from 'react';

import { createFragmentSandbox } from './create-fragment-sandbox';
import { createReactApp } from './frameworks/react-fragment';
import { createAngularApp } from './frameworks/angular-fragment';

import {
	Button,
	CodeSnippet,
	Modal,
	Tab,
	Tabs
} from 'carbon-components-react';
import { css } from 'emotion';
import { ModalContext, ModalActionType } from '../../../../context/modal-context';
import { saveBlob } from '../../../../utils/file-tools';
import { GlobalStateContext } from '../../../../context';
import { ExportImageComponent } from './export-image-component';

const exportCodeModalStyle = css`
	.bx--tab-content {
		height: calc(100% - 40px);
		overflow: auto;
	}
`;

const codeSnippetWrapper = css`
    margin-top: 20px;
    p {
        margin-bottom: 7px;
    }
`;

const titleWrapper = css`
    display: flex;
    margin-top: 30px;
    a, button {
        margin-left: auto;
    }
`;

const codeSnippet = css`
    .bx--copy-btn {
        background: white;
    }
`;

export const ExportModal = ({ fragment }: any) => {
	const { fragments, settings, setSettings } = useContext(GlobalStateContext);
	const [modalState, dispatchModal] = useContext(ModalContext);
	const jsonCode: any = JSON.stringify(fragment.data, null, 2);
	const reactCode: any = createReactApp(fragment, fragments);
	const angularCode: any = createAngularApp(fragment, fragments);

	const generateSandboxUrl = (parameters: any) => (`https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`);

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
			onSelectionChange={(tabIndex: number) => setSettings({ ...settings, selectedExportTabIndex: tabIndex })}>
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
					{
						Object.keys(angularCode).map((fileName: string) => (
							<div className={codeSnippetWrapper} key={fileName}>
								<p>{fileName}</p>
								<CodeSnippet
								type='multi'
								light
								className={codeSnippet}
								copyButtonDescription={`Copy ${fileName} to clipboard`}>
									{
										fileName !== 'package.json'
											? angularCode[fileName]
											: JSON.stringify(angularCode[fileName], null, '\t')
									}
								</CodeSnippet>
							</div>
						))
					}
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
					{
						Object.keys(reactCode).map((fileName: string) => (
							<div className={codeSnippetWrapper} key={fileName}>
								<p>{fileName}</p>
								<CodeSnippet
								type='multi'
								light
								className={codeSnippet}
								copyButtonDescription={`Copy ${fileName} to clipboard`}>
									{
										fileName !== 'package.json'
											? reactCode[fileName]
											: JSON.stringify(reactCode[fileName], null, '\t')
									}
								</CodeSnippet>
							</div>
						))
					}
				</Tab>
				<Tab
				id='json'
				label='JSON'
				role='presentation'
				tabIndex={0}>
					<div className={titleWrapper}>
						<h3>JSON</h3>
						<Button
						kind='ghost'
						onClick={() => saveBlob(new Blob([jsonCode]), `${fragment.title}.json`)}>
							Download JSON
						</Button>
					</div>
					<CodeSnippet
					type='multi'
					light
					className={codeSnippet}
					copyButtonDescription={'Copy JSON to clipboard'}>
						{jsonCode}
					</CodeSnippet>
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
