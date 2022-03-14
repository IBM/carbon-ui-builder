import React, { useContext } from 'react';

import { ShareOptionsModals } from '../share-options-modal';

import { createFragmentSandbox } from './create-fragment-sandbox';
import { createReactApp } from './frameworks/react-fragment';
import { createAngularApp } from './frameworks/angular-fragment';
import { createVanillaApp } from './frameworks/vanilla-fragment';
import { createVueApp } from './frameworks/vue-fragment';

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

const exportCodeModalStyle = css`
	.bx--tabs--scrollable__nav-item {
		width: calc(20% - 1px);
	}

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

interface ExportCodeProps {
	fragment: any;
	displayedModal: ShareOptionsModals | null;
	setDisplayedModal: (displayedModal: ShareOptionsModals | null) => void;
}

export const ExportCode = ({
	fragment,
	displayedModal,
	setDisplayedModal
}: ExportCodeProps) => {
	const { fragments } = useContext(GlobalStateContext);
	const [modalState, dispatchModal] = useContext(ModalContext);
	const jsonCode: any = JSON.stringify(fragment.data, null, 2);
	const vanillaCode: any = createVanillaApp(fragment);
	const reactCode: any = createReactApp(fragment, fragments);
	const angularCode: any = createAngularApp(fragment);
	const vueCode: any = createVueApp(fragment);

	const generateSandboxUrl = (parameters: any) => (`https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`);

	return (
		<Modal
			hasForm
			open={modalState.ShowModal && displayedModal === ShareOptionsModals.CODE_EXPORTS}
			onRequestClose={() => dispatchModal({ type: ModalActionType.closeModal })}
			primaryButtonText='Done'
			secondaryButtonText='Back to export options'
			onRequestSubmit={() => dispatchModal({ type: ModalActionType.closeModal })}
			onSecondarySubmit={() => {
				setDisplayedModal(ShareOptionsModals.SHARE_OPTIONS);
			}}
			modalHeading={`Export "${fragment.title}" code`}
			className={exportCodeModalStyle}>
			<Tabs selected={3}>
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
						{ jsonCode }
					</CodeSnippet>
				</Tab>
				<Tab
					id='vanilla'
					label='Vanilla JS'
					role='presentation'
					disabled
					tabIndex={0}>
					<div className={titleWrapper}>
						<h3>Vanilla JS Code</h3>
						<a
							href={generateSandboxUrl(createFragmentSandbox(vanillaCode))}
							target='_blank'
							rel='noopener noreferrer'>
							Edit on CodeSandbox
						</a>
					</div>
					<p className={css`color: red`}>/Only React works atm/</p>
					{
						Object.keys(vanillaCode).map((fileName: string) => (
							<div className={codeSnippetWrapper} key={fileName}>
								<p>{fileName}</p>
								<CodeSnippet
									type='multi'
									light
									className={codeSnippet}
									copyButtonDescription={`Copy ${fileName} to clipboard`}>
									{
										fileName !== 'package.json'
											? vanillaCode[fileName]
											: JSON.stringify(vanillaCode[fileName], null, '\t')
									}
								</CodeSnippet>
							</div>
						))
					}
				</Tab>
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
					id='vue'
					label='Vue'
					role='presentation'
					disabled
					tabIndex={0}>
					<div className={titleWrapper}>
						<h3>Vue Code</h3>
						<a
							href={generateSandboxUrl(createFragmentSandbox(vueCode))}
							target='_blank'
							rel='noopener noreferrer'>
							Edit on CodeSandbox
						</a>
					</div>
					<p className={css`color: red`}>/Only React works atm/</p>
					{
						Object.keys(vueCode).map((fileName: string) => (
							<div className={codeSnippetWrapper} key={fileName}>
								<p>{fileName}</p>
								<CodeSnippet
									type='multi'
									light
									className={codeSnippet}
									copyButtonDescription={`Copy ${fileName} to clipboard`}>
									{
										fileName !== 'package.json'
											? vueCode[fileName]
											: JSON.stringify(vueCode[fileName], null, '\t')
									}
								</CodeSnippet>
							</div>
						))
					}
				</Tab>
			</Tabs>
		</Modal>
	);
};
