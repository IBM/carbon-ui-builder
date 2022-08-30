import React, {
	useContext,
	useEffect,
	useState
} from 'react';
import { Modal } from 'carbon-components-react';
import { GithubContext, ModalContext } from '../context';
import { LoginGithub } from './login-github';

export const LoginGithubModal = () => {
	const { loginGithubModal, hideLoginGithubModal } = useContext(ModalContext);
	const { token, setToken } = useContext(GithubContext);
	const [tokenString, setTokenString] = useState(token);

	useEffect(() => {
		setTokenString(token);
	}, [token]);

	return <Modal
	size='sm'
	open={loginGithubModal.isVisible}
	onRequestClose={hideLoginGithubModal}
	modalHeading='Log in with GitHub'
	primaryButtonText='Save token'
	onRequestSubmit={() => {
		setToken(tokenString);
		hideLoginGithubModal();
	}}>
		<LoginGithub tokenString={tokenString} setTokenString={setTokenString} />
	</Modal>;
};
