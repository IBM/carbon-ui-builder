import React, { useContext } from 'react';
import {
	HeaderMenu,
	HeaderMenuItem,
	HeaderNavigation,
	HeaderName,
	Header as ShellHeader,
	SkipToContent
} from 'carbon-components-react';
import {
	ChatLaunch16,
	Debug16,
	DocumentAdd16,
	Download16,
	DocumentImport16,
	DocumentExport16,
	Information16,
	Keyboard16,
	LogoGithub16
} from '@carbon/icons-react';
import { css } from 'emotion';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { FragmentWizardModals } from '../routes/dashboard/fragment-wizard/fragment-wizard';
import { saveBlob } from '../utils/file-tools';
import { GlobalStateContext } from '../context';
import { ModalContext } from '../context/modal-context';
import { getEditScreenParams } from '../utils/fragment-tools';

const dividerStyle = css`
	margin: 2px 1rem;
	height: 1px;
	background-color: gray;
	width: calc(100% - 2rem);
`;

const headerName = css`
	&:hover {
		cursor: pointer;
	}

	.bx--text-truncate--end {
		display: inline-flex;

		svg {
			margin-right: 0.5rem;
		}
	}
`;

const headerStyle = css`
	z-index: 8001;
`;

const headerNavStyle = css`
	display: block;
`;

export const Header = ({
	setDisplayedModal,
	displayWizard,
	setDisplayWizard
}: any) => {
	const navigate: NavigateFunction = useNavigate();
	const globalState = useContext(GlobalStateContext);
	const modalContext = useContext(ModalContext);
	const params = getEditScreenParams();
	const fragment = globalState?.fragments.find((fragment: any) => fragment.id === params?.id);

	return (
		<ShellHeader
		aria-label="IBM Carbon UI Builder"
		role='banner'
		tabIndex={0}
		className={headerStyle}>
			<SkipToContent />
			<HeaderName
				prefix="IBM"
				tabIndex={0}
				title='Carbon UI Builder home'
				className={headerName}
				onClick={() => navigate('/')}
				onKeyDown={(event: any) => event.key === 'Enter' && navigate('/')}>
				Carbon UI Builder {process.env.NODE_ENV === 'development' ? 'Dev' : ''}
			</HeaderName>
			<HeaderNavigation aria-label='application menu' className={headerNavStyle}>
				<HeaderMenuItem
				className={headerName}
				onClick={() => navigate('/')}>
					Home
				</HeaderMenuItem>

				{/*         FILE MENU        */}
				<HeaderMenu
				aria-label='file'
				menuLinkName='File'
				className={headerName}>
					<HeaderMenuItem
					className={headerName}
					onClick={() => setDisplayWizard(!displayWizard)}>
						<DocumentAdd16 /> New
					</HeaderMenuItem>
					{
						params?.id && fragment?.data &&
						<HeaderMenuItem
						className={headerName}
						onClick={() => saveBlob(new Blob([JSON.stringify(fragment.data, null, 2)]), `${fragment.title}.json`)}>
							<Download16 /> Save as .json
						</HeaderMenuItem>
					}
					{
						params?.id && fragment?.data &&
						<HeaderMenuItem
						className={headerName}
						onClick={() => modalContext && modalContext.showFragmentExportModal(fragment)}>
							<DocumentExport16 /> Export
						</HeaderMenuItem>
					}
					<HeaderMenuItem
					className={headerName}
					onClick={() => {
						setDisplayWizard(!displayWizard);
						setDisplayedModal(FragmentWizardModals.IMPORT_JSON_MODAL);
					}}>
						<DocumentImport16 /> Open .json
					</HeaderMenuItem>
				</HeaderMenu>

				{/*         FEEDBACK MENU        */}
				<HeaderMenu
				aria-label='feedback'
				menuLinkName='Feedback'
				className={headerName}>
					<HeaderMenuItem
					className={headerName}
					href='https://github.com/IBM/carbon-ui-builder/issues/new'
					target='_blank'>
						<Debug16 /> I found a bug
					</HeaderMenuItem>
				</HeaderMenu>

				{/*         HELP MENU        */}
				<HeaderMenu
				aria-label='help'
				menuLinkName='Help'
				className={headerName}>
					<HeaderMenuItem
					className={headerName}
					onClick={() => navigate('/help/introduction')}>
						<Information16 /> Introduction
					</HeaderMenuItem>
					<HeaderMenuItem
					className={headerName}
					onClick={() => navigate('/help/hotkeys')}>
						<Keyboard16 /> Hotkeys / Shortcuts
					</HeaderMenuItem>
					<HeaderMenuItem
					className={headerName}
					href='https://ibm-studios.slack.com/archives/C02LL3SMXFS'
					target='_blank'>
						<ChatLaunch16 /> I have a question
					</HeaderMenuItem>
					<div className={dividerStyle} />
					<HeaderMenuItem
					className={headerName}
					href='https://github.com/IBM/carbon-ui-builder'
					target='_blank'>
						<LogoGithub16 /> Fork on GitHub
					</HeaderMenuItem>
				</HeaderMenu>
			</HeaderNavigation>
		</ShellHeader>
	);
};
