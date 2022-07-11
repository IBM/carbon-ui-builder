import React, { useState } from 'react';
import {
	Route, BrowserRouter as Router, Routes
} from 'react-router-dom';
import { Notification } from './components/index';
import {
	Dashboard,
	Edit,
	ErrorBoundary,
	NotFound
} from './routes';
import { GlobalStateContextProvider } from './context/global-state-context';
import { ModalContextProvider } from './context/modal-context';
import { NotificationContextProvider } from './context/notification-context';
import { UIShell } from './components/ui-shell';
import { css } from 'emotion';
import { Help } from './routes/help';
import { FragmentWizard, FragmentWizardModals } from './routes/dashboard/fragment-wizard/fragment-wizard';
import { FragmentModal } from './routes/edit/fragment-modal';

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
	const [modalFragment, setModalFragment] = useState<any>(null);
	const [displayWizard, setDisplayWizard] = useState(false);
	// These are states which are shared amongst the three modals.
	const [displayedModal, setDisplayedModal] = useState<FragmentWizardModals | null>(FragmentWizardModals.CREATE_FRAGMENT_MODAL);

	return <Router basename='carbon-ui-builder'>
		<div className={app}>
			<ErrorBoundary>
				<GlobalStateContextProvider>
					<NotificationContextProvider>
						<ModalContextProvider>
							<UIShell
								setDisplayedModal={setDisplayedModal}
								displayWizard={displayWizard}
								setDisplayWizard={setDisplayWizard} />
							<Notification />
							<Routes>
								<Route path='/' element={
									<Dashboard
										displayWizard={displayWizard}
										setDisplayWizard={setDisplayWizard}
										setModalFragment={setModalFragment} />
								} />
								<Route
									path='/edit/:id'
									element={<Edit />} />
								<Route
									path='/help/:id'
									element={<Help />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
							<FragmentWizard
								displayedModal={displayedModal}
								setDisplayedModal={setDisplayedModal}
								shouldDisplay={displayWizard}
								setShouldDisplay={setDisplayWizard} />
							{modalFragment && <FragmentModal fragment={modalFragment} />}
						</ModalContextProvider>
					</NotificationContextProvider>
				</GlobalStateContextProvider>
			</ErrorBoundary>
			<span id="forkongithub">
				<a href="https://github.com/IBM/carbon-ui-builder">Fork on GitHub</a>
			</span>
		</div>
	</Router>;
};
