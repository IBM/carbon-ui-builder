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
	DocumentAdd16,
	Download16,
	DocumentImport16
} from '@carbon/icons-react';
import { css } from 'emotion';
import { matchPath, NavigateFunction, useNavigate } from 'react-router-dom';
import { FragmentWizardModals } from '../routes/dashboard/fragment-wizard/fragment-wizard';
import { saveBlob } from '../utils/file-tools';
import { GlobalStateContext } from '../context';

export const Header = ({
	setDisplayedModal,
	displayWizard,
	setDisplayWizard
}: any) => {
	const navigate: NavigateFunction = useNavigate();
	const { fragments } = useContext(GlobalStateContext);
	const params = matchPath('/edit/:id', window.location.pathname.split('/carbon-components-builder').join(''))?.params;
	const fragment = fragments.find((fragment: any) => fragment.id === params?.id);

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

	const headerNavStyle = css`
		display: block;
	`;

	return (
		<ShellHeader aria-label="IBM Carbon Components Builder" role='banner' tabIndex={0}>
			<SkipToContent />
			<HeaderName
				prefix="IBM"
				tabIndex={0}
				title='Carbon Components Builder home'
				className={headerName}
				onClick={() => navigate('/')}
				onKeyDown={(event: any) => event.key === 'Enter' && navigate('/')}>
				Carbon Components Builder {process.env.NODE_ENV === 'development' ? 'Dev' : ''}
			</HeaderName>
			<HeaderNavigation className={headerNavStyle}>
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
						!!params?.id &&
						<HeaderMenuItem
						className={headerName}
						onClick={() => saveBlob(new Blob([JSON.stringify(fragment.data, null, 2)]), `${fragment.title}.json`)}>
							<Download16 /> Save as .json
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

				{/*         HELP MENU        */}
				<HeaderMenu
				aria-label='help'
				menuLinkName='Help'
				className={headerName}>
					<HeaderMenuItem
					className={headerName}
					onClick={() => navigate('/help/introduction')}>
						Introduction
					</HeaderMenuItem>
					<HeaderMenuItem
					className={headerName}
					onClick={() => navigate('/help/hotkeys')}>
						Hotkeys / Shortcuts
					</HeaderMenuItem>
				</HeaderMenu>
			</HeaderNavigation>
		</ShellHeader>
	);
};
