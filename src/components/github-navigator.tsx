import React, {
	useContext,
	useEffect,
	useState
} from 'react';
import {
	Grid,
	Column,
	Row,
	ClickableTile
} from 'carbon-components-react';
import {
	Document32,
	Folder32,
	FolderDetails32
} from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import { css } from 'emotion';
import { GithubContext } from '../context';
import { UserContext } from '../context/user-context';
import { GithubFilePreview } from './github-file-preview';

const folderItemStyle = css`
	min-width: 10rem;
	height: 6rem;
	margin-top: 2rem;
`;

const FolderItem = ({ repo, item, basePath }: any) => {
	const navigate = useNavigate();

	if (!item) {
		return <ClickableTile className={folderItemStyle} onClick={() => navigate(`${basePath}/${repo.name}`)}>
			<div><FolderDetails32 /></div>
			{repo.name}
		</ClickableTile>;
	}

	return <ClickableTile className={folderItemStyle} onClick={() => navigate(`${basePath}/${repo.name}/${item.path}`)}>
		<div>
			{
				item.type === 'dir' && <Folder32 />
			}
			{
				item.type === 'file' && <Document32 />
			}
		</div>
		{item.name}
	</ClickableTile>;
};

const cleanFolderState = {
	fragmentState: null as any,
	folderContent: [] as any[],
	fileContent: '',
	fileContentBase64: ''
} as any;

export const GithubNavigator = ({ basePath, path, repoName, repoOrg }: any) => {
	const { getContent, getRepos, getUser } = useContext(GithubContext);
	const { githubLogin } = useContext(UserContext);
	const [state, setState] = useState({
		...cleanFolderState,
		repos: [] as any[]
	});

	useEffect(() => {
		if (!githubLogin) {
			return;
		}
		(async () => {
			const repos = await getRepos(repoOrg);
			if (repoName) {
				const content = await getContent(repoOrg || (await getUser()).login, repoName, path || '');

				setState({
					...cleanFolderState,
					...content,
					repos
				});
			} else {
				// no repo requested so we offer all repos to pick from
				setState({
					...cleanFolderState,
					repos
				});
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [repoName, path, githubLogin]);

	const compareItems = (a: any, b: any) => {
		if (a.type === 'dir' && b.type === 'file') {
			return -1;
		}
		if (a.type === 'file' && b.type === 'dir') {
			return 1;
		}
		return a.name - b.name;
	};

	return <Grid>
		<Row>
			{
				repoName
				? state.folderContent.sort(compareItems).map((item: any) => <Column key={item.name}>
					<FolderItem
						basePath={`${basePath}${repoOrg ? `/${repoOrg}` : ''}`}
						repo={state.repos[state.repos.findIndex((repo: any) => repo.name === repoName)]}
						item={item} />
				</Column>)
				: state.repos.sort(compareItems).map((repo: any) => <Column key={repo.name}>
					<FolderItem repo={repo} basePath={`${basePath}${repoOrg ? `/${repoOrg}` : ''}`} />
				</Column>)
			}
			{
				(state.fragmentState || state.fileContent)
				&& <GithubFilePreview
					editorHeight='calc(100vh - 3rem)'
					fragmentState={state.fragmentState}
					fileContent={state.fileContent}
					fileContentBase64={state.fileContentBase64}
					path={path} />
			}
		</Row>
	</Grid>;
};
