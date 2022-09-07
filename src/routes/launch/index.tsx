import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GithubContext } from '../../context';
import { GithubFilePreview } from '../../components/github-file-preview';

export const Launch = () => {
	const params = useParams();
	const { getContent } = useContext(GithubContext);
	const [state, setState] = useState({
		fragmentState: null as any,
		folderContent: [] as any[]
	} as any);

	useEffect(() => {
		if (!params.owner || !params.repo) {
			return;
		}

		getContent(params.owner, params.repo, params['*'] || '').then((content: any) => setState(content));
	}, [params, getContent]);

	if (!params.owner || !params.repo) {
		return <div>Nothing to see here. <a href='/'>Go home.</a></div>;
	}

	if (!state.folderContent?.length && !state.fragmentState && !state.fileContent) {
		return <div>Loading...</div>;
	}

	if (state.folderContent && state.folderContent.length) {
		return <ul>
			{
				state.folderContent.map((item: any) => <li key={item.name}>
					<Link
					className='bx--btn bx--btn--ghost bx--btn--sm'
					to={`/launch/${params.owner}/${params.repo}/${item.path}`}>
						{item.name}{item.type === 'dir' ? '/' : ''}
					</Link>
				</li>)
			}
		</ul>;
	}

	return <GithubFilePreview
		fragmentState={state.fragmentState}
		fileContent={state.fileContent}
		fileContentBase64={state.fileContentBase64} />;
};
