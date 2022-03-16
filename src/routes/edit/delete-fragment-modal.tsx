import React, { useContext } from 'react';

import { Modal } from 'carbon-components-react';
import { ModalActionType, ModalContext } from '../../context/modal-context';
import { GlobalStateContext } from '../../context/global-state-context';
import { useHistory } from 'react-router-dom';
import { NotificationActionType, NotificationContext } from '../../context/notification-context';

export const DeleteFragmentModal = ({ id }: any) => {
	const { fragments, toggleFragmentVisibility, removeFragment } = useContext(GlobalStateContext);
	const [modalState, dispatchModal] = useContext(ModalContext);
	const history = useHistory();
	const [, dispatchNotification] = useContext(NotificationContext);
	const fragment = fragments.find((fragment: any) => fragment.id === id);

	const deleteFragment = () => {
		const undoHideFragment = () => {
			toggleFragmentVisibility(id, false);
		};
		toggleFragmentVisibility(id, true);
		history.push('/');
		dispatchNotification({
			type: NotificationActionType.ADD_NOTIFICATION,
			data: {
				kind: 'error',
				title: 'Fragment deleted!',
				message: `Fragment '${fragment.title}' has been permanently deleted.`,
				action: {
					actionText: 'Undo',
					actionFunction: undoHideFragment,
					onNotificationClose: () => removeFragment(id)
				}
			}
		});
		dispatchModal({ type: ModalActionType.closeModal });
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
