import React from 'react';
import { useParams } from 'react-router-dom';
import { GithubNavigator } from '../../components/github-navigator';

export const Launch = () => {
	const params = useParams();

	if (!params.owner) {
		return <div>Nothing to see here. <a href='/'>Go home.</a></div>;
	}

	return <GithubNavigator
		basePath='/launch'
		path={params['*']}
		repoName={params.repo}
		repoOrg={params.owner}
		showToolbar={false} />;
};
