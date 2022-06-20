import React from 'react';
import {
	HeaderMenu,
	HeaderMenuItem,
	HeaderNavigation,
	HeaderName,
	Header as ShellHeader,
	SkipToContent
} from 'carbon-components-react';
import { css } from 'emotion';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const Header = () => {
	const navigate: NavigateFunction = useNavigate();

	const headerName = css`
		&:hover {
			cursor: pointer;
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
