import React, { useContext } from 'react';

import { Modal } from 'carbon-components-react';
import { ModalActionType, ModalContext } from '../../context/modal-context';
import { GlobalStateContext } from '../../context/global-state-context';
import { useNavigate } from 'react-router-dom';
import { NotificationActionType, NotificationContext } from '../../context/notification-context';

export const DeleteFragmentModal = ({ id }: any) => {
	const { fragments, toggleFragmentVisibility, removeFragment } = useContext(GlobalStateContext);
	const [modalState, dispatchModal] = useContext(ModalContext);
	const navigate = useNavigate();
	const [, dispatchNotification] = useContext(NotificationContext);
	const fragment = fragments.find((fragment: any) => fragment.id === id);

	const deleteFragment = () => {
		toggleFragmentVisibility(id, true);
		dispatchModal({ type: ModalActionType.closeModal });
		dispatchNotification({
			type: NotificationActionType.ADD_NOTIFICATION,
			data: {
				kind: 'error',
				title: 'Fragment deleted!',
				message: `Fragment '${fragment.title}' has been permanently deleted.`,
				action: {
					actionText: 'Undo',
					actionFunction: () => toggleFragmentVisibility(id, false),
					onNotificationClose: () => removeFragment(id)
				}
			}
		});
		navigate('/');
	};

	return (
		<Modal
		size='sm'
		open={modalState.ShowModal}
		onRequestClose={() => dispatchModal({ type: ModalActionType.closeModal })}
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
