import React, { useContext } from 'react';
import { NotificationActionType, NotificationContext } from '../../context/notification-context';
import { Modal } from 'carbon-components-react';
import { ModalActionType, ModalContext } from '../../context/modal-context';
import {
	FragmentActionType,
	FragmentsContext,
	useFetchOne
} from '../../context/fragments-context';
import { useHistory, useLocation } from 'react-router-dom';
import { LocalFragmentsContext, LocalFragmentActionType } from '../../context/local-fragments-context';

import { duplicateFragment } from '../../utils/fragment-tools';

// In the case that fragment modal is used in the dashboard the full fragment containing options and data
// can't be passed in, so fragment id is passed in and `useFragment` is used within this component.
export const DuplicateFragmentModal = ({ id }: any) => {
	const [modalState, dispatchModal] = useContext(ModalContext);
	const [, dispatchNotification] = useContext(NotificationContext);
	const [, updateLocalFragments] = useContext(LocalFragmentsContext);
	const [fragmentsState, dispatch] = useContext(FragmentsContext);
	useFetchOne(id, dispatch);
	const history = useHistory();
	const location = useLocation();

	const fragment = fragmentsState.fragments.find((fragment: any) => fragment.id === id);

	const handleDuplicateFragment = () => {
		if (fragmentsState.currentlyProcessing) {
			return;
		}
		const fragmentCopy = duplicateFragment(fragmentsState.fragments, fragment);

		dispatch({
			type: FragmentActionType.ADD_ONE,
			data: fragmentCopy,
			loaded: true
		});
		updateLocalFragments({
			type: LocalFragmentActionType.ADD,
			data: { id: fragmentCopy.id }
		});
		if (location.pathname !== '/') {
			history.push(`/edit/${fragmentCopy.id}`);
		}
		dispatchNotification({
			type: NotificationActionType.ADD_NOTIFICATION,
			data: {
				kind: 'success',
				title: 'Duplication success',
				message: `'${fragmentCopy.title}  has been duplicated from '${fragment.title}'.`
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
			modalHeading='Duplicate fragment?'
			primaryButtonText='Duplicate'
			primaryButtonDisabled={!!fragmentsState.currentlyProcessing}
			onRequestSubmit={() => handleDuplicateFragment()}>
			<p>
				Click <strong>Duplicate</strong> to begin to edit a copy of the current fragment
				or <strong>Cancel</strong> to continue on this fragment.
			</p>
		</Modal>
	);
};
