import React from 'react';
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

export const App = () => (
	<Router basename='carbon-components-builder'>
		<div className={app}>
			<ErrorBoundary>
				<GlobalStateContextProvider>
					<NotificationContextProvider>
						<UIShell />
						<Notification />
						<ModalContextProvider>
							<Routes>
								<Route path='/' element={<Dashboard />} />
								<Route
									path='/edit/:id'
									element={<Edit />} />
								<Route
									path='/help/:id'
									element={<Help />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</ModalContextProvider>
					</NotificationContextProvider>
				</GlobalStateContextProvider>
			</ErrorBoundary>
			<span id="forkongithub">
				<a href="https://github.com/IBM/carbon-components-builder">Fork on GitHub</a>
			</span>
		</div>
	</Router>
);
