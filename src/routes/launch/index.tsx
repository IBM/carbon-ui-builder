import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';
import { filenameToLanguage } from '../edit/tools';
import { GithubContext } from '../../context';

export const Launch = () => {
	const params = useParams();
	const { getContent } = useContext(GithubContext);
	const [state, setState] = useState({
		fragmentState: null as any,
		folderContent: [] as any[]
	} as any);

	const setFragmentState = (fs: any) => {
		setState({
			...state,
			fragmentState: fs
		});
	};

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

	// fileContent is set when the content we fetched isn't parsed as fragment json
	if (state.fileContent) {
		const chunks = (params['*'] || '').split('.');
		const suffix = chunks[chunks.length - 1];

		// if file is an image
		if (
			suffix === 'jpg' ||
			suffix === 'jpeg' ||
			suffix === 'png' ||
			suffix === 'gif' ||
			suffix === 'svg' ||
			suffix === 'ico'
		) {
			return <img src={`data:image/${suffix};base64,${state.fileContentBase64}`} />;
		}

		// show non-image content in an editor
		return <Editor
			height='100vh'
			language={filenameToLanguage(params['*'] || '')}
			value={state.fileContent}
		/>;
	}

	return <UIFragment state={state.fragmentState} setState={(state) => setFragmentState(state)} />;
};
