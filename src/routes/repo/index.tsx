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
import { useNavigate, useParams } from 'react-router-dom';
import { css } from 'emotion';
import { GithubContext } from '../../context';
import { UserContext } from '../../context/user-context';

const repoContainerStyle = css`
	margin-top: 3rem;
`;

const folderItemStyle = css`
	min-width: 10rem;
	height: 6rem;
	margin-top: 2rem;
`;

const FolderItem = ({ repo, item }: any) => {
	const navigate = useNavigate();

	if (!item) {
		return <ClickableTile className={folderItemStyle} onClick={() => navigate(`/repo/${repo.name}`)}>
			<div><FolderDetails32 /></div>
			{repo.name}
		</ClickableTile>;
	}

	return <ClickableTile className={folderItemStyle} onClick={() => navigate(`/repo/${repo.name}/${item.path}`)}>
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

export const Repo = () => {
	const params = useParams();
	const { getContent, getRepos, getUser } = useContext(GithubContext);
	const { githubLogin } = useContext(UserContext);
	const [state, setState] = useState({
		fragmentState: null as any,
		folderContent: [] as any[],
		userRepos: [] as any[]
	} as any);

	useEffect(() => {
		if (!githubLogin) {
			return;
		}
		(async () => {
			const userRepos = await getRepos();
			if (params.id) {
				const { folderContent, fragmentState } = await getContent((await getUser()).login, params.id, params['*'] || '');

				setState({
					...state,
					folderContent,
					fragmentState,
					userRepos
				});
			} else {
				// no repo requested so we offer all repos to pick from
				setState({
					...state,
					folderContent: [],
					fragmentState: null,
					userRepos
				});
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id, params['*'], githubLogin]);

	const compareItems = (a: any, b: any) => {
		if (a.type === 'dir' && b.type === 'file') {
			return -1;
		}
		if (a.type === 'file' && b.type === 'dir') {
			return 1;
		}
		return a.name - b.name;
	};

	return <div className={repoContainerStyle}>
		<Grid>
			<Row>
				{
					params.id
					? state.folderContent.sort(compareItems).map((item: any) => <Column key={item.name}>
						<FolderItem
						repo={state.userRepos[state.userRepos.findIndex((repo: any) => repo.name === params.id)]}
						item={item} />
					</Column>)
					: state.userRepos.sort(compareItems).map((repo: any) => <Column key={repo.name}><FolderItem repo={repo} /></Column>)
				}
			</Row>
		</Grid>
	</div>;
};
