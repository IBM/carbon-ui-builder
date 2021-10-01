import React, { useState, useContext } from 'react';
import { Permissions } from './permissions/permissions';
import { FragmentPermission } from './permissions/permission.interface';

import {
	Modal,
	Tab,
	Tabs
} from 'carbon-components-react';
import { Image32, Code32 } from '@carbon/icons-react';

import { css } from 'emotion';
import {
	FragmentActionType,
	FragmentsContext
} from '../../../context/fragments-context';
import {
	ModalActionType,
	ModalContext
} from '../../../context/modal-context';
import { ExportCode } from './exports/export-code-modal';
import { SelectionTile } from '../../../components/selection-tile';
import { ExportImageModal } from './exports/export-image-modal';

const tabs = css`
	// Keeps width of tabs 100% when focused
	@media screen and (min-width: 42rem) {
		.bx--tabs__nav-item--selected:not(.bx--tabs__nav-item--disabled) .bx--tabs__nav-link:focus {
			width: 100%;
		}
	}

	ul {
		width: 100%;
		li {
			width: 100%;
			a {
				width: 100%;
			}
		}
	}
`;

const modalContentWrapper = css`
	padding-left: 15px;
	padding-right: 15px;
`;

const headerText = css`
	margin-bottom: 30px;
`;

const exportOptionTileWrapper = css`
	width: 50%;
	height: 200px;
	.bx--tile {
		height: 100%;
		width: 100%;
		p {
			position: absolute;
			bottom: 15px;
		}
	}
`;

const exportOptionsWrapper = css`
	display: flex;
	div:first-child {
		margin-right: 20px;
	}
`;

export enum ShareOptionsModals {
	SHARE_OPTIONS,
	CODE_EXPORTS,
	IMAGE_EXPORTS
}

export enum ShareOptionsTabs {
	PERMISSIONS,
	EXPORTS
}

enum Exports {
	CODE,
	IMAGE
}

interface ShareOptionsModalState {
	selectedShareOptionsTab: ShareOptionsTabs,
	isFragmentPublic: boolean,
	fragmentPermissions: FragmentPermission[],
	selectedExportOption: Exports | null
}

export const ShareOptionsModal = ({ fragment }: any) => {
	const [modalState, dispatchModal] = useContext(ModalContext);
	const [, dispatch] = useContext(FragmentsContext);
	const [displayedModal, setDisplayedModal]
		= useState<ShareOptionsModals | null>(ShareOptionsModals.SHARE_OPTIONS);

	let initialFragmentPermissions = fragment.owners.map((owner: string) => ({
		email: owner,
		permission: 'Owner'
	}));

	if (fragment.sharing !== 'public' && fragment.sharing !== false) {
		const sharePermissions = fragment.sharing.users.map((sharee: string) => ({
			email: sharee,
			permission: 'Read only'
		}));
		initialFragmentPermissions = initialFragmentPermissions.concat(sharePermissions);
	}

	// This contains all the states that control the share options modal.
	const [shareOptionsState, setShareOptionsState] = useState<ShareOptionsModalState>({
		selectedShareOptionsTab: ShareOptionsTabs.PERMISSIONS,
		isFragmentPublic: fragment.sharing === 'public',
		// Contains an array of all the permissions currently set. Items are in the form:
		// `{ email: string, permission: string }`
		fragmentPermissions: initialFragmentPermissions,
		selectedExportOption: null
	});

	const submitPermissions = () => {
		const owners = shareOptionsState.fragmentPermissions
			.filter((fragmentPermission: FragmentPermission) => fragmentPermission.permission === 'Owner')
			.map((owners: any) => owners.email);
		let sharing: false | 'public' | { users: string[] };
		if (shareOptionsState.isFragmentPublic) {
			sharing = 'public';
		} else {
			sharing = {
				users: shareOptionsState.fragmentPermissions
					.filter((fragmentPermission: FragmentPermission) => fragmentPermission.permission === 'Read only')
					.map((readOnlys: any) => readOnlys.email)
			};

			if (!sharing.users.length) {
				sharing = false;
			}
		}

		dispatch({
			type: FragmentActionType.UPDATE_ONE,
			data: {
				...fragment,
				owners,
				sharing
			},
			loaded: true
		});

		dispatchModal({ type: ModalActionType.closeModal });
	};

	const handleExportSelection = () => {
		if (shareOptionsState.selectedExportOption === Exports.CODE) {
			setDisplayedModal(ShareOptionsModals.CODE_EXPORTS);
		} else if (shareOptionsState.selectedExportOption === Exports.IMAGE) {
			setDisplayedModal(ShareOptionsModals.IMAGE_EXPORTS);
		}
	};

	const shareModalSwitcher = () => {
		switch (displayedModal) {
			case ShareOptionsModals.SHARE_OPTIONS:
				return (
					<Modal
						hasForm
						onRequestSubmit={() => {
						// eslint-disable-next-line @typescript-eslint/no-unused-expressions
							shareOptionsState.selectedShareOptionsTab === ShareOptionsTabs.EXPORTS
								? handleExportSelection()
								: shareOptionsState.selectedShareOptionsTab === ShareOptionsTabs.PERMISSIONS
								&& submitPermissions();
						}}
						open={modalState.ShowModal && displayedModal === ShareOptionsModals.SHARE_OPTIONS}
						onRequestClose={() => dispatchModal({ type: ModalActionType.closeModal })}
						primaryButtonText='Done'
						primaryButtonDisabled={
							shareOptionsState.selectedShareOptionsTab === ShareOptionsTabs.EXPORTS
						&& shareOptionsState.selectedExportOption === null
						}
						secondaryButtonText='Cancel'
						modalHeading={`Share '${fragment.title}'`}>
						<p className={headerText}>
						You can collaborate on this fragment by adding users or export the fragment for use
						</p>
						<Tabs
							className={tabs}
							onSelectionChange={(selected: number) => {
								setShareOptionsState({
									...shareOptionsState,
									selectedShareOptionsTab: selected
								});
							}}
							ariaLabel='listbox'
							selected={0}
							type='default'>
							{/**
						 * The tabs need to be in this order since it sets
						 * `shareOptionsState` based on the tabindex.
						 */}
							<Tab
								id='share-fragment'
								label='Share with others'
								role='presentation'
								tabIndex={0}>
								<div className={modalContentWrapper}>
									<Permissions
										fragment={fragment}
										shareOptionsState={shareOptionsState}
										setShareOptionsState={setShareOptionsState}
									/>
								</div>
							</Tab>
							<Tab
								id='export-options'
								label='Export'
								role='presentation'
								tabIndex={0}>
								<div className={exportOptionsWrapper}>
									<SelectionTile
										styles={exportOptionTileWrapper}
										onChange={() => {
											setShareOptionsState({
												...shareOptionsState,
												selectedExportOption: Exports.CODE
											});
										}}
										icon={<Code32 />}
										selected={shareOptionsState.selectedExportOption === Exports.CODE}
										label='Code' />
									<SelectionTile
										styles={exportOptionTileWrapper}
										onChange={() => {
											setShareOptionsState({
												...shareOptionsState,
												selectedExportOption: Exports.IMAGE
											});
										}}
										icon={<Image32 />}
										selected={shareOptionsState.selectedExportOption === Exports.IMAGE}
										label='Image' />
								</div>
							</Tab>
						</Tabs>
					</Modal>
				);
			case ShareOptionsModals.CODE_EXPORTS:
				return (
					<ExportCode
						fragment={fragment}
						displayedModal={displayedModal}
						setDisplayedModal={setDisplayedModal} />
				);
			case ShareOptionsModals.IMAGE_EXPORTS:
			default:
				return <ExportImageModal
					fragment={fragment}
					displayedModal={displayedModal}
					setDisplayedModal={setDisplayedModal}/>;
		}
	};

	return shareModalSwitcher();
};
