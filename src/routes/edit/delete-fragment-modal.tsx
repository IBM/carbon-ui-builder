import React, { useContext } from 'react';

import { Modal } from 'carbon-components-react';
import { ModalActionType, ModalContext } from '../../context/modal-context';
import {
	FragmentActionType,
	FragmentsContext,
	useFetchOne
} from '../../context/fragments-context';
import { useHistory } from 'react-router-dom';
import { NotificationActionType, NotificationContext } from '../../context/notification-context';

export const DeleteFragmentModal = ({ id }: any) => {
	const [fragmentsState, dispatch] = useContext(FragmentsContext);
	const [modalState, dispatchModal] = useContext(ModalContext);
	const history = useHistory();
	const [, dispatchNotification] = useContext(NotificationContext);
	const fragment = fragmentsState.fragments.find((fragment: any) => fragment.id === id);
	useFetchOne(id, dispatch);


	const deleteFragment = () => {
		dispatch({
			type: FragmentActionType.TOGGLE_VISIBILITY,
			id,
			hidden: true,
			loaded: true
		});
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
					onNotificationClose: doDeleteFragment
				}
			}
		});
		dispatchModal({ type: ModalActionType.closeModal });
	};

	const undoHideFragment = () => {
		dispatch({
			type: FragmentActionType.TOGGLE_VISIBILITY,
			id,
			hidden: false,
			loaded: true
		});
	};

	const doDeleteFragment = () => {
		dispatch({
			type: FragmentActionType.REMOVE_FRAGMENT,
			id
		});
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
