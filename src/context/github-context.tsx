import React, {
	createContext,
	useContext,
	useEffect,
	useRef
} from 'react';
import { Octokit } from 'octokit';
import { Buffer } from 'buffer';
import { GlobalStateContext } from './global-state-context';
import { isFragment } from '../ui-fragment/src/utils';

const GithubContext: React.Context<any> = createContext({});

GithubContext.displayName = 'GithubContext';

const compareItems = (a: any, b: any) => {
	if (a.type === 'dir' && b.type === 'file') {
		return -1;
	}
	if (a.type === 'file' && b.type === 'dir') {
		return 1;
	}
	return a.name - b.name;
};

const GithubContextProvider = ({ children }: any) => {
	const { githubToken, setGithubToken: _setGithubToken } = useContext(GlobalStateContext);
	const user = useRef({} as any);
	const reposCache = useRef({} as any);
	const octokit = useRef(new Octokit({ auth: githubToken }));

	const getUser = async (forceLoad = false) => {
		if (!githubToken) {
			return {};
		}

		if (!user.current.login || forceLoad) {
			const u = (await octokit.current.rest.users.getAuthenticated()).data;
			user.current = u;
		}

		return user.current;
	};

	useEffect(() => {
		if (githubToken) {
			getUser(true);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [githubToken]);

	const setGithubToken = (t: string) => {
		octokit.current = new Octokit({ auth: t });
		_setGithubToken(t);
	};

	const getContent = async (owner: string, repo: string, contentPath: string, format: 'raw' | 'object' = 'object') => {
		let path = contentPath;
		if (path.endsWith('/')) {
			// github doesn't like when we're fetching with a slash, so we remove it
			path = path.substring(0, path.length - 1);
		}

		const response = await octokit.current.rest.repos.getContent({
			mediaType: {
				format
			},
			owner,
			repo,
			path
		});

		if (format === 'raw') {
			return response;
		}

		// repos use entries
		if (Array.isArray((response.data as any)?.entries)) {
			return {
				fragmentState: null,
				folderContent: (response.data as any)?.entries.sort(compareItems)
			};
		}

		// data is array if path is of a folder
		if (Array.isArray(response.data)) {
			return {
				fragmentState: null,
				folderContent: response.data.sort(compareItems)
			};
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
			if (!isFragment(responseObject)) {
				throw Error('JSON is not a fragment');
			}

			return {
				folderContent: [],
				fragmentState: responseObject
			};
		} catch (error) {
			// if parsing file as json fails (in case it's not json or doesn't look like fragment json)
			// it's some other file - template below decides how to render it
			return {
				fragmentState: null,
				folderContent: [],
				fileContent: data,
				fileContentBase64: dataBase64
			};
		}
	};

	const getContentWithFolder = async (owner: string, repo: string, contentPath: string, format: 'raw' | 'object' = 'object') => {
		const contentState: any = await getContent(owner, repo, contentPath, format);

		const pathParts = contentPath.split('/');

		if (contentState.fileContent || contentState.fileContentBase64 || contentState.fragmentState) {
			return {
				...(await getContent(owner, repo, pathParts.slice(0, pathParts.length - 1).join('/'), format)),
				fileContent: contentState.fileContent,
				fileContentBase64: contentState.fileContentBase64,
				fragmentState: contentState.fragmentState
			};
		}

		return contentState;
	};

	const getRepos = async (username: string | null = null, forceLoad = false) => {
		const un = username ? username : user.current.login;

		if (!reposCache.current[un]?.length || forceLoad) {
			const repos = (await octokit.current.rest.repos.listForUser({ username: un })).data;
			reposCache.current[un] = repos.sort(compareItems);
		}

		return reposCache.current[un];
	};

	const getFeaturedFragments = async () => {
		const featuredFragmentsResponse = await getContent('IBM', 'carbon-ui-builder-featured-fragments', 'featured-fragments', 'raw');

		const allFeaturedFragments = await Promise.all(((featuredFragmentsResponse as any).data as any[]).map(async (item) => {
			const fragmentFileResponse = await getContent('IBM', 'carbon-ui-builder-featured-fragments', item.path, 'raw');
			try {
				const data = JSON.parse((fragmentFileResponse as any).data.toString());

				// I know what this looks like but if data has data, it's a fragment
				if (data.data) {
					return data;
				}

				return {
					id: item.path,
					title: item.name.substring(0, item.name.length - 5),
					lastModified: new Date((fragmentFileResponse as any).headers['last-modified'] || '').toISOString(),
					data
				};
			} catch (error) {
				return null;
			}
		}));

		return allFeaturedFragments.filter(fragment => fragment !== null);
	};

	const getBuiltInTemplates = async () => {
		const featuredFragmentsResponse = await getContent('IBM', 'carbon-ui-builder-featured-fragments', 'built-in-templates', 'raw');

		const allFeaturedFragments = await Promise.all(((featuredFragmentsResponse as any).data as any[]).map(async (item) => {
			const fragmentFileResponse = await getContent('IBM', 'carbon-ui-builder-featured-fragments', item.path, 'raw');
			try {
				const data = JSON.parse((fragmentFileResponse as any).data.toString());

				// I know what this looks like but if data has data, it's a fragment
				if (data.data) {
					return data;
				}

				return {
					id: item.path,
					title: item.name.substring(0, item.name.length - 5),
					lastModified: new Date((fragmentFileResponse as any).headers['last-modified'] || '').toISOString(),
					data
				};
			} catch (error) {
				return null;
			}
		}));

		return allFeaturedFragments.filter(fragment => fragment !== null);
	};

	return (
		<GithubContext.Provider value={{
			token: githubToken,
			setToken: setGithubToken,
			getFeaturedFragments,
			getBuiltInTemplates,
			getContent,
			getContentWithFolder,
			getUser,
			getRepos
		}}>
			{children}
		</GithubContext.Provider>
	);
};

export {
	GithubContext,
	GithubContextProvider
};
