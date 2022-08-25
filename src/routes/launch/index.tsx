import { Octokit } from 'octokit';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Buffer } from 'buffer';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';
import { filenameToLanguage } from '../edit/tools';

const githubContentRequest = {
	mediaType: {
		format: 'object'
	},
	owner: '',
	repo: '',
	path: ''
};

const octokit = new Octokit();

export const Launch = () => {
	const params = useParams();
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

		(async () => {
			let path = params['*'] || '';
			if (path.endsWith('/')) {
				// github doesn't like when we're fetching with a slash, so we remove it
				path = path.substring(0, path.length - 1);
			}

			const response = await octokit.rest.repos. getContent({
				...githubContentRequest,
				owner: params.owner || '',
				repo: params.repo || '',
				path
			});

			// repos use entries
			if (Array.isArray((response.data as any)?.entries)) {
				setState({
					fragmentState: null,
					folderContent: (response.data as any)?.entries
				});
				return;
			}

			// data is array if path is of a folder
			if (Array.isArray(response.data)) {
				setState({
					fragmentState: null,
					folderContent: response.data
				});
				return;
			}

			// response.data is a string for text files (?)
			let data: any = response.data;
			let dataBase64 = '';

			// if response.data isn't a string, it's an object and has base64 encoded content
			if (typeof data !== 'string') {
				dataBase64 = (response.data as any).content || '';
				data = Buffer.from(dataBase64, (response.data as any).encoding).toString();
			}

			try {
				const responseObject = JSON.parse(`${data}`);
				if (!responseObject.id || !responseObject.items || !Array.isArray(responseObject.items)) {
					throw Error('JSON is not a fragment');
				}

				setState({
					folderContent: [],
					fragmentState: responseObject
				});
			} catch (error) {
				// if parsing file as json fails (in case it's not json or doesn't look like fragment json)
				// it's some other file - template below decides how to render it
				setState({
					fragmentState: null,
					folderContent: [],
					fileContent: data,
					fileContentBase64: dataBase64
				});
			}
		})();
	}, [params]);

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
