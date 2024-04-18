import React, { useContext } from 'react';
import { Modal } from '@carbon/react';
import { GithubContext, ModalContext } from '../context';

export const LogoutGithubModal = () => {
	const { logoutGithubModal, hideLogoutGithubModal } = useContext(ModalContext);
	const { setToken } = useContext(GithubContext);

	return <Modal
	size='sm'
	open={logoutGithubModal.isVisible}
	onRequestClose={hideLogoutGithubModal}
	modalHeading='Confirm log out'
	primaryButtonText='Log out'
	onRequestSubmit={() => {
		setToken('');
		hideLogoutGithubModal();
	}}>
		Are you sure you want to log out?
	</Modal>;
};
