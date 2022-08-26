import React from 'react';
import { GlobalStateContextProvider } from './global-state-context';
import { ModalContextProvider } from './modal-context';
import { NotificationContextProvider } from './notification-context';

export const ContextProviders = ({ children }: any) =>
<GlobalStateContextProvider>
	<NotificationContextProvider>
		<ModalContextProvider>
			{children}
		</ModalContextProvider>
	</NotificationContextProvider>
</GlobalStateContextProvider>;
