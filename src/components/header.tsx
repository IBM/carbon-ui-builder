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
	DocumentImport16,
	DocumentExport16
} from '@carbon/icons-react';
import { css } from 'emotion';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { FragmentWizardModals } from '../routes/dashboard/fragment-wizard/fragment-wizard';
import { saveBlob } from '../utils/file-tools';
import { GlobalStateContext } from '../context';
import { ModalActionType, ModalContext } from '../context/modal-context';
import { getEditScreenParams } from '../utils/fragment-tools';

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
						onClick={() => modalContext && Array.isArray(modalContext) && modalContext.length >= 2 && modalContext[1]({ // dispatchModal
							type: ModalActionType.setExportModal,
							id: fragment.id
						})}>
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
