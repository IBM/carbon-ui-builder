import React, { useContext } from 'react';
import { ModalType, ModalContext } from '../../context/modal-context';
import { DuplicateFragmentModal } from './duplicate-fragment-modal';
import { DeleteFragmentModal } from './delete-fragment-modal';
import { ExportModal } from './share-options/exports/export-modal';

// eslint-disable-next-line react/prop-types
export const FragmentModal = ({ fragment }: any) => {
	const [modalState] = useContext(ModalContext);

	switch (modalState.ModalType) {
		case ModalType.DUPLICATION:
			return (
			// In the case that fragment modal is used in the dashboard the full fragment containing options and
			// data can't be passed in, so we use fragment id and fetch it
			// eslint-disable-next-line react/prop-types
				<DuplicateFragmentModal id={fragment.id}/>
			);
		case ModalType.EXPORT:
			return (
			// eslint-disable-next-line react/prop-types
				<ExportModal fragment={fragment} />
			);
		case ModalType.DELETION:
			return (
			// eslint-disable-next-line react/prop-types
				<DeleteFragmentModal id={fragment.id} />
			);
		default:
			return null;
	}
};
