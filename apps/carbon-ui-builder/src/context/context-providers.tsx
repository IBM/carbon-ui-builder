import React from 'react';
import { GithubContextProvider } from './github-context';
import { GlobalStateContextProvider } from './global-state-context';
import { ModalContextProvider } from './modal-context';
import { NotificationContextProvider } from './notification-context';
import { UserContextProvider } from './user-context';

export const ContextProviders = ({ children }: any) =>
<GlobalStateContextProvider>
	<GithubContextProvider>
		<UserContextProvider>
			<NotificationContextProvider>
				<ModalContextProvider>
					{children}
				</ModalContextProvider>
			</NotificationContextProvider>
		</UserContextProvider>
	</GithubContextProvider>
</GlobalStateContextProvider>;
