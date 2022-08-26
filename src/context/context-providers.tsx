import React from 'react';
import { GithubContextProvider } from './github-context';
import { GlobalStateContextProvider } from './global-state-context';
import { ModalContextProvider } from './modal-context';
import { NotificationContextProvider } from './notification-context';

export const ContextProviders = ({ children }: any) =>
<GlobalStateContextProvider>
	<GithubContextProvider>
		<NotificationContextProvider>
			<ModalContextProvider>
				{children}
			</ModalContextProvider>
		</NotificationContextProvider>
	</GithubContextProvider>
</GlobalStateContextProvider>;
