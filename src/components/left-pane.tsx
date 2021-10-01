import React, { useContext } from 'react';
import { css } from 'emotion';
import {
	HeaderSideNavItems,
	SideNav,
	SideNavItem,
	SideNavItems,
	SideNavMenu
} from 'carbon-components-react';
import { FragmentsContext } from '../context/fragments-context';
import { useHistory } from 'react-router';
import { HeaderMenuItemLink } from './header-menu-item-link';

const sideNav = css`
	border-right: 1px solid #D6D6D6;
`;

// Side nav is fixed when not in the edit screen
// it won't automatically open at 66 rem.
const fixedSideNav = css`
	@media screen and (min-width: 66rem) {
		transform: translateX(-16rem);
	}
`;

export const LeftPane = ({ isSideNavExpanded }: any) => {
	const [fragmentState] = useContext(FragmentsContext);
	const history = useHistory();
	const location = history.location.pathname;

	const id = `${fragmentState.currentId}`;
	const fragment = fragmentState.fragments.find((fragment: any) => fragment.id === id);

	const inEdit = !!location.match(/\/edit\//) && fragment;

	return (
		<SideNav
			aria-label={inEdit && fragment && fragment.title
				? `Modify options for '${fragment.title}'`
				: 'Side navigation'
			}
			tabindex={0}
			isFixedNav={!inEdit}
			expanded={isSideNavExpanded}
			className={`${sideNav} ${!inEdit ? fixedSideNav : ''}`}>
			<SideNavItems>
				<HeaderSideNavItems hasDivider>
					<HeaderMenuItemLink to="" key="">
						More menus
					</HeaderMenuItemLink>
				</HeaderSideNavItems>
				{
					inEdit && <>
						<SideNavMenu title='General'>
							<SideNavItem>Chicken</SideNavItem>
						</SideNavMenu>
					</>
				}
			</SideNavItems>
		</SideNav>
	);
};
