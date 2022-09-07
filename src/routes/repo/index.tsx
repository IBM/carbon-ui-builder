import React from 'react';
import { useParams } from 'react-router-dom';
import { css } from 'emotion';
import { GithubNavigator } from '../../components/github-navigator';

const repoContainerStyle = css`
	margin-top: 3rem;
`;

export const Repo = () => {
	const params = useParams();

	return <div className={repoContainerStyle}>
		<GithubNavigator basePath='/repo' path={params['*']} repoName={params.id} />
	</div>;
};
