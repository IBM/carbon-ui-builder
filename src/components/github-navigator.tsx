import React, {
	useContext,
	useEffect,
	useState
} from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	Button,
	FlexGrid,
	Column,
	Row,
	ClickableTile
} from '@carbon/react';
import {
	CopyLink,
	Document,
	Folder,
	FolderDetails,
	NextOutline,
	PreviousOutline
} from '@carbon/react/icons';
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

const FolderItem = ({ repoName, item, basePath }: any) => {
	const navigate = useNavigate();

	if (!item) {
		return <ClickableTile
		className={folderItemStyle}
		light={true}
		onClick={() => navigate(`${basePath}/${repoName}`)}>
			<div><FolderDetails size={32} /></div>
			{repoName}
		</ClickableTile>;
	}

	return <ClickableTile
	className={folderItemStyle}
	light={true}
	onClick={() => navigate(`${basePath}/${repoName}/${item.path}`)}>
		<div>
			{
				item.type === 'dir' && <Folder size={32} />
			}
			{
				item.type === 'file' && <Document size={32} />
			}
		</div>
		{item.name}
	</ClickableTile>;
};

const toolbarStyle = css`
	display: flex;
	justify-content: space-between;
	padding-left: 2rem;
	padding-right: 2rem;
	margin-top: 1rem;
	box-shadow: inset 0px -1px #d8d8d8;
`;

const breadcrumbStyle = css`
	padding-top: 1rem;
	padding-bottom: 1rem;
`;

const folderContentStyleWithToolbar = css`
	background-color: #f4f4f4;
	min-height: calc(100% - 3rem);
`;

const folderContentStyle = css`
	background-color: #f4f4f4;
	min-height: 100%;
`;

const toolbarButtonsStyle = css`
	right: 0;
`;

const separatorStyle = css`
	width: 1px;
	height: calc(100% - 1rem);
	background-color: #c6c6c6;
	margin: 0.5rem;
	display: inline-block;
`;

const previewContainerStyle = css`
	height: 100%;
`;

const findNth = (heystack: string, needle: string, n: number) => {
	// finds the index of n-th occurance of needle in heystack
	let position = -1;

	for (let i = 0; i < n; i++) {
		const pos = heystack.indexOf(needle, position + 1);

		if (pos < 0) {
			position = heystack.length;
			break;
		}
		position = pos;
	}

	return position;
};

const cleanFolderState = {
	fragmentState: null as any,
	folderContent: [] as any[],
	fileContent: '',
	fileContentBase64: ''
} as any;

export const GithubNavigator = ({ basePath, path, repoName, repoOrg, showToolbar=true }: any) => {
	const navigate = useNavigate();
	const { getContentWithFolder, getRepos } = useContext(GithubContext);
	const { githubLogin } = useContext(UserContext);
	const [state, setState] = useState({
		...cleanFolderState,
		repos: [] as any[]
	});

	useEffect(() => {
		(async () => {
			const repos = await getRepos(repoOrg);
			if (repoName) {
				const content = await getContentWithFolder(repoOrg || githubLogin, repoName, path || '');

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

	const getFilesList = () => state.folderContent.filter((item: any) => item.type === 'file');

	const getFileIndex = () => getFilesList().findIndex((item: any) => path === item.path);

	return <>
		{
			showToolbar
			&& <div className={toolbarStyle}>
				<Breadcrumb className={breadcrumbStyle} noTrailingSlash>
					<BreadcrumbItem
					href={basePath}
					isCurrentPage={!repoName}
					onClick={(event: any) => {
						event.nativeEvent.preventDefault();
						navigate(basePath);
					}}>
						repo
					</BreadcrumbItem>
					{
						repoName
						&& <BreadcrumbItem
						href={`${basePath}/${repoName}`}
						isCurrentPage={!path}
						onClick={(event: any) => {
							event.nativeEvent.preventDefault();
							navigate(`${basePath}/${repoName}`);
						}}>
							{repoName}
						</BreadcrumbItem>
					}
					{
						path && path.split('/').map((item: string, index: number) => <BreadcrumbItem
						key={index}
						href={`${basePath}/${repoName}/${path.substring(0, findNth(path, '/', index + 1))}`}
						isCurrentPage={index === path.split('/').length - 1}
						onClick={(event: any) => {
							event.nativeEvent.preventDefault();
							navigate(`${basePath}/${repoName}/${path.substring(0, findNth(path, '/', index + 1))}`);
						}}>
							{item}
						</BreadcrumbItem>)
					}
				</Breadcrumb>
				<div className={toolbarButtonsStyle}>
					<Button
						kind='ghost'
						hasIconOnly
						iconDescription='Copy sharable link'
						renderIcon={CopyLink}
						tooltipPosition='bottom'
						tooltipAlignment='end'
						onClick={() => {
							navigator.clipboard.writeText(`${window.location.origin}/launch/${githubLogin}/${repoName}/${path}`);
						}} />
					{
						(state.fragmentState || state.fileContent) && <>
							<div className={separatorStyle} />
							<Button
								kind='ghost'
								hasIconOnly
								disabled={getFileIndex() <= 0}
								iconDescription='Previous file'
								renderIcon={PreviousOutline}
								tooltipPosition='bottom'
								tooltipAlignment='start'
								onClick={() => {
									navigate(`${basePath}/${repoName}/${getFilesList()[getFileIndex() - 1].path}`);
								}} />
							<Button
								kind='ghost'
								hasIconOnly
								disabled={getFileIndex() >= getFilesList().length - 1}
								iconDescription='Next file'
								renderIcon={NextOutline}
								tooltipPosition='bottom'
								tooltipAlignment='start'
								onClick={() => {
									navigate(`${basePath}/${repoName}/${getFilesList()[getFileIndex() + 1].path}`);
								}} />
						</>
					}
				</div>
			</div>
		}
		{
			(state.fragmentState || state.fileContent)
				? <div className={previewContainerStyle}>
					<GithubFilePreview
						editorHeight='calc(100vh - 3rem)'
						fragmentState={state.fragmentState}
						fileContent={state.fileContent}
						fileContentBase64={state.fileContentBase64}
						path={path} />
				</div>
				: <div className={showToolbar ? folderContentStyleWithToolbar : folderContentStyle}>
					<FlexGrid>
						<Row>
							{
								repoName
								? state.folderContent.map((item: any) => <Column key={item.name}>
									<FolderItem
										basePath={`${basePath}${repoOrg ? `/${repoOrg}` : ''}`}
										repoName={repoName}
										item={item} />
								</Column>)
								: state.repos.map((repo: any) => <Column key={repo.name}>
									<FolderItem repoName={repo.name} basePath={`${basePath}${repoOrg ? `/${repoOrg}` : ''}`} />
								</Column>)
							}
						</Row>
					</FlexGrid>
				</div>
		}
	</>;
};
