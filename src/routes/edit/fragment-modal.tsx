import { ModalType, ModalContext } from '../../context/modal-context';
import { ShareOptionsModal } from './share-options/share-options-modal';
import { DuplicateFragmentModal } from './duplicate-fragment-modal';
import { DeleteFragmentModal } from './delete-fragment-modal';
import { SettingsFragmentModal } from './settings-fragment-modal';
import React, { useContext, useEffect } from 'react';
import { FragmentsContext } from '../../context/fragments-context';

// eslint-disable-next-line react/prop-types
export const FragmentModal = ({ fragment }: any) => {
	const { fetchOne } = useContext(FragmentsContext);
	const [modalState] = useContext(ModalContext);

	useEffect(() => {
		fetchOne(fragment.id);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fragment.id]);

	switch (modalState.ModalType) {
		case ModalType.DUPLICATION:
			return (
			// In the case that fragment modal is used in the dashboard the full fragment containing options and
			// data can't be passed in, so we use fragment id and fetch it
			// eslint-disable-next-line react/prop-types
				<DuplicateFragmentModal id={fragment.id}/>
			);
		case ModalType.SHARING:
			return (
			// eslint-disable-next-line react/prop-types
				<ShareOptionsModal fragment={fragment} />
			);
		case ModalType.DELETION:
			return (
			// eslint-disable-next-line react/prop-types
				<DeleteFragmentModal id={fragment.id} />
			);
		case ModalType.SETTINGS:
			return (
			// eslint-disable-next-line react/prop-types
				<SettingsFragmentModal fragment={fragment} />
			);
		default:
			return null;
	}
};
