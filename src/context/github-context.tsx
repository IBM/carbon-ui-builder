import React, {
	createContext,
	useContext,
	useEffect,
	useRef
} from 'react';
import { Octokit } from 'octokit';
import { Buffer } from 'buffer';
import { GlobalStateContext } from './global-state-context';

const GithubContext: React.Context<any> = createContext({});

GithubContext.displayName = 'GithubContext';

const GithubContextProvider = ({ children }: any) => {
	const { githubToken, setGithubToken: _setGithubToken } = useContext(GlobalStateContext);
	const user = useRef({} as any);
	const userRepos = useRef([] as any[]);
	const octokit = useRef(new Octokit({ auth: githubToken }));

	const getUser = async (forceLoad = false) => {
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
				folderContent: (response.data as any)?.entries
			};
		}

		// data is array if path is of a folder
		if (Array.isArray(response.data)) {
			return {
				fragmentState: null,
				folderContent: response.data
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
			if (!responseObject.id || !responseObject.items || !Array.isArray(responseObject.items)) {
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

	const getRepos = async (forceLoad = false) => {
		if (!userRepos.current.length || forceLoad) {
			const repos = (await octokit.current.rest.repos.listForUser({ username: user.current.login })).data;
			userRepos.current = repos;
		}

		return userRepos.current;
	};

	const getFeaturedFragments = async () => {
		const featuredFragmentsResponse = await getContent('IBM', 'carbon-ui-builder-featured-fragments', 'featured-fragments', 'raw');

		const allFeaturedFragments = await Promise.all(((featuredFragmentsResponse as any).data as any[]).map(async (item) => {
			const fragmentFileResponse = await getContent('IBM', 'carbon-ui-builder-featured-fragments', item.path, 'raw');
			try {
				return {
					id: item.path,
					title: item.name.substring(0, item.name.length - 5),
					lastModified: new Date((fragmentFileResponse as any).headers['last-modified'] || '').toISOString(),
					data: JSON.parse((fragmentFileResponse as any).data.toString())
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
			getContent,
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
