import React, { useContext, useEffect, useState } from 'react';

import {
	Button,
	Checkbox,
	Dropdown,
	Modal,
	Tab,
	Tabs,
	TabList,
	TabPanel,
	TabPanels,
	TreeNode,
	TreeView,
	InlineNotification
} from '@carbon/react';
import { Copy } from '@carbon/react/icons';
import { css } from 'emotion';
import Editor, { useMonaco } from '@monaco-editor/react';

import { createReactApp as createReactAppV10 } from './frameworks/react/v10/fragment';
import { createAngularApp as createAngularAppV10 } from './frameworks/angular/v10/fragment';
import { createReactApp } from './frameworks/react/latest/fragment';
import { createAngularApp } from './frameworks/angular/latest/fragment';

import { ModalContext } from '../../../../context/modal-context';
import { saveBlob } from '../../../../utils/file-tools';
import { GlobalStateContext } from '../../../../context';
import { ExportImageComponent } from './export-image-component';
import { filenameToLanguage, getFragmentJsonExportString } from '../../../../sdk/src/tools';
import JSONCrush from 'jsoncrush';

const exportCodeModalStyle = css`
	.cds--tab-content {
		height: calc(100% - 40px);
		overflow: hidden;
	}

	.cds--tree {
		overflow-x: auto;
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

const notificationStyle = css`
	margin-top: 1rem;
`;

const tabListStyle = css`
	.cds--tab--list {
		overflow: visible;
	}
`;

const versionDropdownStyle = css`
	width: 13rem;
	position: absolute;
	right: 1rem;
`;

const renderCodeTree = (nodes: any, path = '') => {
	if (!nodes) {
		return;
	}

	return nodes.map(({
		items,
		icon,
		isExpanded,
		name,
		code,
		...nodeProps
	}: any) => {
		const fullPath = `${path}${path ? '/' : ''}${name}`;

		return <TreeNode
			key={fullPath}
			id={fullPath}
			renderIcon={icon}
			isExpanded={isExpanded}
			value={code}
			label={name}
			{...nodeProps}>
			{renderCodeTree(items, fullPath)}
		</TreeNode>;
	});
};

const FileNames = ({ code, setSelectedFileItem }: any) => <div className={fileNamesContainerStyle}>
	<TreeView label='Code' onSelect={(_event: any, selectedItem: any) => {
		if (selectedItem.value !== undefined && selectedItem.value !== null) {
			setSelectedFileItem(selectedItem);
		}
	}}>
		{renderCodeTree(code)}
	</TreeView>
</div>;

const copyToClipboard = (codeString: string) => {
	navigator.clipboard.writeText(codeString);
};

const CodeView = ({ selectedFileItem }: any) => {
	const codeString = selectedFileItem.id !== 'package.json' && selectedFileItem.name !== 'package.json'
		? selectedFileItem.value || selectedFileItem.code
		: JSON.stringify(selectedFileItem.value || selectedFileItem.code, null, '\t');

	return <div className={codeSnippetWrapperStyle}>
		<p>
			{selectedFileItem.id || selectedFileItem.name}
			<Button
				kind='ghost'
				size='sm'
				hasIconOnly
				iconDescription='Copy to clipboard'
				onClick={() => copyToClipboard(codeString)}
				renderIcon={() => <Copy size={16} />} />
		</p>
		<Editor
			height='calc(100% - 32px)'
			language={filenameToLanguage(selectedFileItem.id || selectedFileItem.name)}
			value={codeString || ''}
			options={{ readOnly: true }}
		/>
	</div>;
};

const findTreeItemByPath = (node: any, path: string, currentPath = ''): any => {
	if (Array.isArray(node)) {
		for (const item of node) {
			// Recursively call the function on each item
			const result = findTreeItemByPath(item, path);
			// If the result is not null, return it
			if (result) {
				return result;
			}
		}
		return null;
	}

	const fullPath = `${currentPath}${currentPath ? '/' : ''}${node.name}`;

	if (fullPath === path) {
		return node;
	}

	if (node.items) {
		for (const item of node.items) {
			const result = findTreeItemByPath(item, path, fullPath);
			if (result) {
				return result;
			}
		}
	}

	return null;
};

export const ExportModal = () => {
	const { fragments, settings, setSettings, styleClasses, customComponentsCollections } = useContext(GlobalStateContext);
	const { fragmentExportModal, hideFragmentExportModal } = useContext(ModalContext);
	const [selectedAngularFileItem, setSelectedAngularFileItem] = useState({
		id: 'src/app/app.component.ts'
	} as any);
	const [selectedReactFileItem, setSelectedReactFileItem] = useState({
		id: 'src/component.js'
	} as any);
	const [shouldStripUnnecessaryProps, setShouldStripUnnecessaryProps] = useState(true);
	const [shouldExportForPreviewOnly, setShouldExportForPreviewOnly] = useState(false);
	const [version, setVersion] = useState('v11');
	const [reactCode, setReactCode] = useState([] as any[]);
	const [angularCode, setAngularCode] = useState([] as any[]);

	const monaco = useMonaco();

	const carbonVersions = [
		{ id: 'v10' },
		{ id: 'v11' }
	];

	useEffect(() => {
		if (!fragmentExportModal.isVisible) {
			return;
		}
		let fileItem = findTreeItemByPath(angularCode, selectedAngularFileItem?.id || 'src/app/app.component.ts');
		if (!fileItem) {
			// this happens in case the previously selected file doesn't exist in new code so we select default
			fileItem = findTreeItemByPath(angularCode, 'src/app/app.component.ts');
		}

		setSelectedAngularFileItem(fileItem || selectedAngularFileItem);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [angularCode, fragmentExportModal.isVisible]);

	useEffect(() => {
		if (!fragmentExportModal.isVisible) {
			return;
		}

		if (fragmentExportModal?.fragment) {
			switch (version) {
				case 'v10':
					setReactCode(createReactAppV10(fragmentExportModal.fragment, fragments, styleClasses));
					setAngularCode(createAngularAppV10(fragmentExportModal.fragment, fragments, styleClasses));
					break;
				default:
					setReactCode(createReactApp(fragmentExportModal.fragment, fragments, styleClasses));
					setAngularCode(createAngularApp(fragmentExportModal.fragment, fragments, styleClasses, customComponentsCollections));
					break;
			}
			return;
		}

		setReactCode([]);
		setAngularCode([]);
	}, [customComponentsCollections, fragmentExportModal.fragment, fragmentExportModal.isVisible, fragments, styleClasses, version]);

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

	const getSharableLink = () => {
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

		return link + encodeURIComponent(JSONCrush.crush(JSON.stringify(jsonExport)));
	};

	return (
		<Modal
			passiveModal
			open={fragmentExportModal.isVisible}
			onRequestClose={hideFragmentExportModal}
			size='lg'
			modalHeading={`Export "${fragmentExportModal.fragment.title}" code`}
			className={exportCodeModalStyle}>
			{
				fragmentExportModal.isVisible &&
				<Tabs onChange={(tabIndex: number) => {
					setSettings({ ...settings, selectedExportTabIndex: tabIndex });
				}}>
					<TabList aria-label='Export list' className={tabListStyle}>
						<Tab>Angular</Tab>
						<Tab>React</Tab>
						<Tab>JSON</Tab>
						<Tab>Image</Tab>
						<Tab>Link</Tab>
						<Dropdown
							id='export-version-selector'
							titleText='Select carbon version'
							hideLabel={true}
							label='Dropdown menu options'
							className={versionDropdownStyle}
							items={carbonVersions}
							selectedItem={{ id: version }}
							itemToString={(item: any) => item ? item.id : ''}
							onChange={({ selectedItem }: any) => setVersion(selectedItem.id)} />
					</TabList>
					{
						version !== 'v11' &&
						<InlineNotification
							className={notificationStyle}
							kind='info'
							lowContrast={true}
							hideCloseButton
							statusIconDescription='notification'
							title='Some things may look different or not exist in older versions of Carbon.' />
					}
					<TabPanels>
						<TabPanel>
							<div className={titleWrapper}>
								<h3>Angular Code</h3>
							</div>
							<div className={tabContentStyle}>
								<FileNames code={angularCode} setSelectedFileItem={setSelectedAngularFileItem} />
								<CodeView selectedFileItem={selectedAngularFileItem} />
							</div>
						</TabPanel>
						<TabPanel>
							<div className={titleWrapper}>
								<h3>React Code</h3>
							</div>
							<div className={tabContentStyle}>
								<FileNames code={reactCode} setSelectedFileItem={setSelectedReactFileItem} />
								<CodeView selectedFileItem={selectedReactFileItem} />
							</div>
						</TabPanel>
						<TabPanel>
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
										renderIcon={() => <Copy size={16} />} />
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
						</TabPanel>
						<TabPanel>
							<div className={titleWrapper}>
								<h3>Image</h3>
							</div>
							<ExportImageComponent fragment={fragmentExportModal.fragment} />
						</TabPanel>
						<TabPanel>
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
									onChange={(_: any, { checked }: any) => setShouldStripUnnecessaryProps(checked)} />
								<Checkbox
									id='preview-only'
									checked={shouldExportForPreviewOnly}
									labelText='Preview only'
									onChange={(_: any, { checked }: any) => setShouldExportForPreviewOnly(checked)} />

								<iframe
									src={getSharableLink()}
									className={css`width: 100%; height: calc(100vh - 550px); margin-bottom: 1rem; margin-top: 1rem;`} />

								<Button className={css`margin-right: 1rem;`} onClick={() => copyToClipboard(getSharableLink())}>
									Copy link
								</Button>
								<a
									className='cds--link--inline cds--btn cds--btn--secondary'
									href={getSharableLink()}
									target='_blank'
									rel='noreferrer'>
									Open in new tab
								</a>
							</div>
						</TabPanel>
					</TabPanels>
				</Tabs>
			}
		</Modal>
	);
};
