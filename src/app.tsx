import React, { useState } from 'react';
import {
	Route,
	BrowserRouter as Router,
	Routes,
	Outlet
} from 'react-router-dom';
import { Notification } from './components/index';
import {
	Dashboard,
	Edit,
	ErrorBoundary,
	NotFound
} from './routes';
import { UIShell } from './components/ui-shell';
import { css } from 'emotion';
import { Help } from './routes/help';
import { View } from './routes/view';
import { PreviewJson } from './routes/preview-json';
import { FromJson } from './routes/from-json';
import { FragmentWizard, FragmentWizardModals } from './routes/dashboard/fragment-wizard/fragment-wizard';
import { AllModals } from './routes/edit/all-modals';
import { Launch } from './routes/launch';
import { ContextProviders } from './context/context-providers';
import { Repo } from './routes/repo';

const app = css`
	nav.bx--side-nav--expanded + div#edit-content {
		padding-left: calc(2.25rem + 16rem);
	}
	// This is the viewport width that causes the edit header items to overlap
	@media screen and (max-width: 38.75rem) {
		nav.bx--side-nav--expanded + div#edit-content {
			padding-left: 36px;
		}
	}
`;

export const App = () => {
	const [displayWizard, setDisplayWizard] = useState(false);
	// These are states which are shared amongst the three modals.
	const [displayedModal, setDisplayedModal] = useState<FragmentWizardModals | null>(FragmentWizardModals.CREATE_FRAGMENT_MODAL);

	const DefaultContainer = () => <>
		<UIShell
			setDisplayedModal={setDisplayedModal}
			displayWizard={displayWizard}
			setDisplayWizard={setDisplayWizard} />
		<Notification />
		<Outlet />

		<FragmentWizard
			displayedModal={displayedModal}
			setDisplayedModal={setDisplayedModal}
			shouldDisplay={displayWizard}
			setShouldDisplay={setDisplayWizard} />
		<AllModals />
	</>;

	return <Router basename='/'>
		<div className={app}>
			<ErrorBoundary>
				<ContextProviders>
					<Routes>
						<Route element={<Outlet />}>
							<Route path='/view/:id' element={<View />} />
							<Route path='/preview-json/:json' element={<PreviewJson />} />
							<Route path='/launch' element={<Launch />} />
							<Route path='/launch/:owner' element={<Launch />} />
							<Route path='/launch/:owner/:repo/*' element={<Launch />} />
						</Route>
						<Route element={<DefaultContainer />}>
							<Route path='/' element={
								<Dashboard
									displayWizard={displayWizard}
									setDisplayWizard={setDisplayWizard}
									setDisplayedModal={setDisplayedModal} />
							} />
							<Route path='/edit/:id' element={<Edit />} />
							<Route path='/from-json/:json' element={<FromJson />} />
							<Route path='/help/:id' element={<Help />} />
							<Route path='/repo' element={<Repo />} />
							<Route path='/repo/:id/*' element={<Repo />} />
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</ContextProviders>
			</ErrorBoundary>
		</div>
	</Router>;
};
