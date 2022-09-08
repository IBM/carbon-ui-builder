import { css } from 'emotion';
import React from 'react';
import { useParams } from 'react-router-dom';
import { GithubNavigator } from '../../components/github-navigator';

const launchContainerStyle = css`
	height: 100vh;
`;

export const Launch = () => {
	const params = useParams();

	if (!params.owner) {
		return <div>Nothing to see here. <a href='/'>Go home.</a></div>;
	}

	return <div className={launchContainerStyle}>
		<GithubNavigator
			basePath='/launch'
			path={params['*']}
			repoName={params.repo}
			repoOrg={params.owner}
			showToolbar={false} />
	</div>;
};
