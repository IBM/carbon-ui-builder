import React, { useContext } from 'react';

import { Modal } from 'carbon-components-react';
import { ModalContext } from '../../context/modal-context';
import { GlobalStateContext } from '../../context/global-state-context';
import { useNavigate } from 'react-router-dom';
import { NotificationActionType, NotificationContext } from '../../context/notification-context';

export const FragmentDeleteModal = () => {
	const { fragments, toggleFragmentVisibility, removeFragment } = useContext(GlobalStateContext);
	const {
		fragmentDeleteModal,
		hideFragmentDeleteModal
	} = useContext(ModalContext);
	const navigate = useNavigate();
	const [, dispatchNotification] = useContext(NotificationContext);
	const fragment = fragments.find((fragment: any) => fragment.id === fragmentDeleteModal.fragmentId);

	const deleteFragment = () => {
		toggleFragmentVisibility(fragment.id, true);
		hideFragmentDeleteModal();
		dispatchNotification({
			type: NotificationActionType.ADD_NOTIFICATION,
			data: {
				kind: 'error',
				title: 'Fragment deleted!',
				message: `Fragment '${fragment.title}' has been permanently deleted.`,
				action: {
					actionText: 'Undo',
					actionFunction: () => toggleFragmentVisibility(fragment.id, false),
					onNotificationClose: () => removeFragment(fragment.id)
				}
			}
		});
		navigate('/');
	};

	return (
		<Modal
		size='sm'
		open={fragmentDeleteModal.isVisible}
		onRequestClose={hideFragmentDeleteModal}
		secondaryButtonText='Cancel'
		modalHeading='Delete this fragment?'
		danger
		primaryButtonText='Delete'
		onRequestSubmit={() => deleteFragment()}>
			<p>
				Click <strong>Cancel</strong> to go back to editing your fragment
				or <strong>Delete</strong> to remove it permanently.
			</p>
		</Modal>
	);
};
