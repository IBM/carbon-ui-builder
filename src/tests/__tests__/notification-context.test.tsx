import React, { useContext } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { getNodeText } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import {
	NotificationContextProvider,
	NotificationContext,
	NotificationActionType
} from '../../context/notification-context';

const notificationState = {
	type: NotificationActionType.ADD_NOTIFICATION,
	data: {
		kind: 'error',
		title: 'Fragment deleted!',
		message: 'Fragment has been permanently deleted.'
	}
};

const TestComponent = () => {
	const [state, dispatch] = useContext(NotificationContext);
	return (
		<>
			<span data-testid='notification-indicator'>
				{ state.notifications.length ? 'Displayed' : 'Invisible' }
			</span>
			<button
				data-testid='notification-trigger'
				onClick={() => {
					dispatch(notificationState);
				}}>
			</button>
		</>
	);
};

describe('<NotificationContextProvider />', () => {
	it('renders and displays given title and message when triggered', () => {
		const { getByTestId } = render(
			<NotificationContextProvider>
				<TestComponent />
			</NotificationContextProvider>
		);

		expect(getNodeText(getByTestId('notification-indicator'))).toEqual('Invisible');
		fireEvent.click(getByTestId('notification-trigger'));
		expect(getNodeText(getByTestId('notification-indicator'))).toEqual('Displayed');
	});
});
