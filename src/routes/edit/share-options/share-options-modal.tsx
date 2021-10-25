import React, { useState, useContext } from 'react';

import { Modal } from 'carbon-components-react';
import { Image32, Code32 } from '@carbon/icons-react';

import { css } from 'emotion';
import {
	ModalActionType,
	ModalContext
} from '../../../context/modal-context';
import { ExportCode } from './exports/export-code-modal';
import { SelectionTile } from '../../../components/selection-tile';
import { ExportImageModal } from './exports/export-image-modal';


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

enum Exports {
	CODE,
	IMAGE
}

interface ShareOptionsModalState {
	selectedExportOption: Exports | null
}

export const ShareOptionsModal = ({ fragment }: any) => {
	const [modalState, dispatchModal] = useContext(ModalContext);
	const [displayedModal, setDisplayedModal]
		= useState<ShareOptionsModals | null>(ShareOptionsModals.SHARE_OPTIONS);

	// This contains all the states that control the share options modal.
	const [shareOptionsState, setShareOptionsState] = useState<ShareOptionsModalState>({
		selectedExportOption: null
	});

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
						onRequestSubmit={handleExportSelection}
						open={modalState.ShowModal && displayedModal === ShareOptionsModals.SHARE_OPTIONS}
						onRequestClose={() => dispatchModal({ type: ModalActionType.closeModal })}
						primaryButtonText='Done'
						primaryButtonDisabled={ shareOptionsState.selectedExportOption === null }
						secondaryButtonText='Cancel'
						modalHeading={`Share '${fragment.title}'`}>
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
