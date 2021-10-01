import React, { createContext, useReducer } from 'react';

const NotificationContext: React.Context<any> = createContext({});

NotificationContext.displayName = 'NotificationContext';

export type NotificationData = {
	kind: string;
	title: string;
	message: string;
	id: number,
	action?: any;
}
export interface BaseNotificationAction {
	type: NotificationActionType,
	data: NotificationData;
	action?: Action
}

export type NotificationAction =
	NotificationActionAdd |
	NotificationActionRemove;


export enum NotificationActionType {
	ADD_NOTIFICATION,
	REMOVE_NOTIFICATION
}

export interface NotificationActionAdd extends BaseNotificationAction {
	type: NotificationActionType.ADD_NOTIFICATION;
}

export interface NotificationActionRemove extends BaseNotificationAction {
	type: NotificationActionType.REMOVE_NOTIFICATION;
}

interface Action {
	actionText: string,
	actionFunction: any,
	onNotificationClose: any
}


export interface NotificationState {
	notifications: NotificationData[]
}

const initialState = { notifications: [] };
let notificationCounter = 0;

const NotificationReducer = (state: NotificationState, action: NotificationAction) => {
	switch (action.type) {
		case NotificationActionType.REMOVE_NOTIFICATION:
			return {
				...state,
				notifications: state.notifications.filter(
					(notification: NotificationData) => notification.id !== action.data.id
				)
			};
		case NotificationActionType.ADD_NOTIFICATION:
			return {
				...state,
				notifications: [
					...state.notifications,
					{
						...action.data,
						id: notificationCounter++
					}
				]
			};
		default: return state;
	}
};

const NotificationContextProvider = ({ children }: any) => {
	const notification = useReducer(NotificationReducer, initialState);
	return (
		<NotificationContext.Provider value={notification}>
			{children}
		</NotificationContext.Provider>
	);
};

export {
	NotificationContext,
	NotificationContextProvider
};
