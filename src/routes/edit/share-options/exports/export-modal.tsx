import React, { useContext, useEffect, useState } from 'react';

import {
	Button,
	Checkbox,
	Modal,
	Tab,
	Tabs
} from 'carbon-components-react';
import { Copy16, Document16 } from '@carbon/icons-react';
import { css } from 'emotion';
import Editor, { useMonaco } from '@monaco-editor/react';

import { createFragmentSandbox } from './create-fragment-sandbox';
import { createReactApp } from './frameworks/react/fragment-v10';
import { createAngularApp } from './frameworks/angular/fragment-v10';

import { ModalContext } from '../../../../context/modal-context';
import { saveBlob } from '../../../../utils/file-tools';
import { GlobalStateContext } from '../../../../context';
import { ExportImageComponent } from './export-image-component';
import { filenameToLanguage, getFragmentJsonExportString } from '../../../../sdk/src/tools';

const exportCodeModalStyle = css`
	.bx--tab-content {
		height: calc(100% - 40px);
		overflow: hidden;
	}
`;

const titleWrapper = css`
    display: flex;
    form, a, button {
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
				renderIcon={Copy16} />
		</p>
		<Editor
			height='calc(100% - 32px)'
			language={filenameToLanguage(selectedFilename)}
			value={codeString}
			options={{ readOnly: true }}
		/>
	</div>;
};

export const ExportModal = () => {
	const { fragments, settings, setSettings, styleClasses } = useContext(GlobalStateContext);
	const { fragmentExportModal, hideFragmentExportModal } = useContext(ModalContext);
	const [selectedAngularFilename, setSelectedAngularFilename] = useState('src/app/app.component.ts' as string);
	const [selectedReactFilename, setSelectedReactFilename] = useState('src/component.js' as string);
	const [shouldStripUnnecessaryProps, setShouldStripUnnecessaryProps] = useState(true);
	const [shouldExportForPreviewOnly, setShouldExportForPreviewOnly] = useState(false);

	const monaco = useMonaco();

	useEffect(() => {
		monaco?.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
			noSemanticValidation: true,
			noSyntaxValidation: true
		});
	}, [monaco]);

	if (!fragmentExportModal?.fragment) {
		return null;
	}

	const jsonCode: any = getFragmentJsonExportString(fragmentExportModal.fragment, fragments, styleClasses);
	const reactCode: any = createReactApp(fragmentExportModal.fragment, fragments);
	const angularCode: any = createAngularApp(fragmentExportModal.fragment, fragments);

	return (
		<Modal
			passiveModal
			open={fragmentExportModal.isVisible}
			onRequestClose={hideFragmentExportModal}
			size='lg'
			modalHeading={`Export "${fragmentExportModal.fragment.title}" code`}
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
						<form
							action='https://codesandbox.io/api/v1/sandboxes/define'
							method='POST'
							target='_blank'>
							<input type='hidden' name='parameters' value={createFragmentSandbox(angularCode)} />
							<button type='submit' className={css`border: none; cursor: pointer;`}>
								<img src='https://codesandbox.io/static/img/play-codesandbox.svg' alt='Edit on Codesandbox' />
							</button>
						</form>
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
						<form
							action='https://codesandbox.io/api/v1/sandboxes/define'
							method='POST'
							target='_blank'>
							<input type='hidden' name='parameters' value={createFragmentSandbox(reactCode)} />
							<button type='submit' className={css`border: none; cursor: pointer;`}>
								<img src='https://codesandbox.io/static/img/play-codesandbox.svg' alt='Edit on Codesandbox' />
							</button>
						</form>
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
								tooltipPosition='right'
								iconDescription='Copy to clipboard'
								onClick={() => copyToClipboard(jsonCode)}
								renderIcon={Copy16} />
						</h3>
						<Button
							kind='ghost'
							onClick={() => saveBlob(new Blob([jsonCode]), `${fragmentExportModal.fragment.title}.json`)}>
							Download JSON
						</Button>
					</div>
					<Editor
						height={contentHeight}
						language='json'
						value={jsonCode}
						options={{ readOnly: true }} />
				</Tab>
				<Tab
					id='image'
					label='Image'
					role='presentation'
					tabIndex={0}>
					<div className={titleWrapper}>
						<h3>Image</h3>
					</div>
					<ExportImageComponent fragment={fragmentExportModal.fragment} />
				</Tab>
				<Tab
					id='link'
					label='Link'
					role='presentation'
					tabIndex={0}>
					<div className={titleWrapper}>
						<h3>Link</h3>
					</div>
					<div>
						<p className={css`margin-top: 1rem; margin-bottom: 1rem; font-style: italic;`}>
							Some applications may not be able to handle long URLs or data URLs properly.
							Different browsers and servers have different maximum lengths for URLs.
							If you try to encode/pack more data than that, your url may be truncated or rejected,
							resulting in data loss or corruption.
						</p>
						<Checkbox
							id='strip-unnecessary'
							checked={shouldStripUnnecessaryProps}
							labelText='Strip unnecessary properties'
							onChange={(checked: boolean) => setShouldStripUnnecessaryProps(checked)}/>
						<Checkbox
							id='preview-only'
							checked={shouldExportForPreviewOnly}
							labelText='Preview only'
							onChange={(checked: boolean) => setShouldExportForPreviewOnly(checked)}/>
						<br />
						<Button onClick={() => {
							let link = location.protocol + '//' + location.host;
							const jsonExport = JSON.parse(jsonCode);

							if (shouldStripUnnecessaryProps) {
								// remove id and lastModified
								delete jsonExport.id;
								delete jsonExport.lastModified;
							}

							if (shouldExportForPreviewOnly) {
								link += '/preview-json/';
							} else {
								link += '/from-json/';
							}
							copyToClipboard(link + encodeURIComponent(JSON.stringify(jsonExport)));
						}}>
							Copy link
						</Button>
					</div>
				</Tab>
			</Tabs>
		</Modal>
	);
};
