import React, { useContext, useEffect } from 'react';

import { Modal } from 'carbon-components-react';
import { ModalActionType, ModalContext } from '../../context/modal-context';
import { FragmentsContext } from '../../context/fragments-context';
import { useHistory } from 'react-router-dom';
import { NotificationActionType, NotificationContext } from '../../context/notification-context';

export const DeleteFragmentModal = ({ id }: any) => {
	const { fragmentsState, toggleVisibility, fetchOne, removeFragment } = useContext(FragmentsContext);
	const [modalState, dispatchModal] = useContext(ModalContext);
	const history = useHistory();
	const [, dispatchNotification] = useContext(NotificationContext);
	const fragment = fragmentsState.fragments.find((fragment: any) => fragment.id === id);

	useEffect(() => {
		fetchOne(id);
	}, [id]);


	const deleteFragment = () => {
		toggleVisibility(id, true);
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
					onNotificationClose: () => { removeFragment(id) }
				}
			}
		});
		dispatchModal({ type: ModalActionType.closeModal });
	};

	const undoHideFragment = () => {
		toggleVisibility(id, false);
	};

	return (
		<Modal
			size='sm'
			open={modalState.ShowModal}
			onRequestClose={() => { dispatchModal({ type: ModalActionType.closeModal }); }}
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
