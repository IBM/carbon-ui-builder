import React, { useContext } from 'react';
import { InlineNotification, NotificationActionButton } from 'carbon-components-react';
import {
	NotificationContext,
	NotificationActionType,
	NotificationData
} from '../context/notification-context';
import { css } from 'emotion';

const notificationStyle = { minWidth: '30rem' };

const notificationAreaStyle = css`
	left: 50%;
	transform: translateX(-50%);
	position: absolute;
	z-index: 2;
	min-width: 30rem;
	top: 2rem;
`;

export const Notification = () => {
	const [state, dispatch] = useContext(NotificationContext);
	return (
		<div className={notificationAreaStyle} role="alert">
			{state.notifications.map((notification: NotificationData, index: number) => (
				<InlineNotification
					lowContrast
					aria-live="assertive"
					kind={notification.kind}
					title={notification.title}
					subtitle={notification.message}
					caption={null}
					key={notification.id}
					onCloseButtonClick={() => {
						if (notification.action) {
							notification.action.onNotificationClose();
						}
						dispatch({
							type: NotificationActionType.REMOVE_NOTIFICATION,
							data: notification
						});
					}}
					style={notificationStyle}
					actions={notification.action
						? <NotificationActionButton
							onClick={() => {
								notification.action.actionFunction();
								dispatch({
									type: NotificationActionType.REMOVE_NOTIFICATION,
									data: notification
								});
							}}>
							{notification.action.actionText}
						</NotificationActionButton>
						: undefined}
				/>
			))}
		</div>
	);
};
