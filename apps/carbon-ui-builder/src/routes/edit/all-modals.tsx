import React, { useContext } from 'react';
import { Modal } from '@carbon/react';
import { ModalContext } from '../../context/modal-context';
import { FragmentDuplicateModal } from './fragment-duplicate-modal';
import { FragmentDeleteModal } from './fragment-delete-modal';
import { ExportModal } from './share-options/exports/export-modal';
import { FragmentPreviewModal } from './fragment-preview-modal';
import { LoginGithubModal } from '../../components/login-github-modal';
import { LogoutGithubModal } from '../../components/logout-github-modal';
import { CustomComponentsModal } from '../../components/custom-components-modal';

// eslint-disable-next-line react/prop-types
export const AllModals = () => {
	const {
		modal,
		hideModal,
		fragmentPreviewModal
	} = useContext(ModalContext);

	return <>
		<Modal
			size={modal.size || 'sm'}
			open={modal.isVisible}
			onRequestClose={() => hideModal()}
			secondaryButtonText={modal.secondaryButtonText}
			modalHeading={modal.modalHeading || 'Message'}
			primaryButtonText={modal.primaryButtonText || 'OK'}
			onRequestSubmit={() => modal.onRequestSubmit ? modal.onRequestSubmit() : hideModal()}>
			{ modal.component }
		</Modal>

		<FragmentDuplicateModal />
		<FragmentDeleteModal />
		<ExportModal />
		{
			fragmentPreviewModal && fragmentPreviewModal?.fragment && // needed to properly initialize fragmentState
			<FragmentPreviewModal />
		}
		<LoginGithubModal />
		<LogoutGithubModal />
		<CustomComponentsModal />
	</>;
};
