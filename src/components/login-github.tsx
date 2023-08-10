import React from 'react';
import { TextInput } from 'carbon-components-react';
import { css } from 'emotion';

const loginGithubStyle = css`
	p {
		margin-bottom: 0.5rem;
	}

	.bx--form-item {
		margin-top: 1rem;
	}
`;

export const LoginGithub = ({
	tokenString,
	setTokenString
}: any) => {

	return <div className={loginGithubStyle}>
		<p>If you don&apos;t have a GitHub account, you&apos;ll need to create one.</p>
		<p><a href='https://github.com/settings/tokens/new' target='_blank' rel="noreferrer">Generate a token on GitHub.</a></p>
		<p>Giving UI Builder access to &quot;repo&quot; will allow you to use your private repos.</p>
		<p>When your token expires, you&apos;ll need to generate a new one.</p>

		<TextInput
			labelText='Your GitHub token'
			id='github-token-input'
			name='github-token'
			placeholder='Paste your token here'
			type='password'
			size='lg'
			value={tokenString}
			onChange={(event: any) => setTokenString(event.target.value)} />
	</div>;
};
