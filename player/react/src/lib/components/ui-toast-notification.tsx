import React from 'react';
import { CssClasses, SendSignal } from '../types';
import {
	ToastNotification
} from '@carbon/react';

import { commonSlots, slotsDisabled } from '../common-slots';

export interface ToastNotificationState {
	id: string;
	type: string;
	isLowContrast?: boolean;
	isHideCloseButton?: boolean;
	kind?: string;
	link?: string;
	subtitle?: string;
	linkText?: string;
	title?: string;
	iconDescription?: string;
	caption?: string;
	cssClasses?: CssClasses[];
}

export const type = 'notification';

export const signals = ['valueChange', 'click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	isLowContrast: 'boolean',
	setLowContrast: (state: ToastNotificationState) => ({
		...state,
		isLowContrast: true
	}),
	setHighContrast: (state: ToastNotificationState) => ({
		...state,
		isLowContrast: false
	}),
	toggleContrast: (state: ToastNotificationState) => ({
		...state,
		isLowContrast: !state.isLowContrast
	}),
	hideCloseButton: 'boolean',
	toHideCloseButton: (state: ToastNotificationState) => ({
		...state,
		hideCloseButton: true
	}),
	toShowCloseButton: (state: ToastNotificationState) => ({
		...state,
		hideCloseButton: false
	}),
	toggleCloseButton: (state: ToastNotificationState) => ({
		...state,
		hideCloseButton: !state.isHideCloseButton
	}),
	type: 'string',
	kind: 'string',
	link: 'string',
	subtitle: 'string',
	linkText: 'string',
	title: 'string',
	iconDescription: 'string',
	caption: 'string'
};

export const UIToastNotification = ({ state, sendSignal }: {
	state: ToastNotificationState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'notification') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <ToastNotification
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
	onClick={() => {
		sendSignal(state.id, 'click');
	}}
	onChange={(event: any) => {
		sendSignal(state.id, 'valueChange', [event.value], { ...state, value: event.value });
	}}
	caption={state.caption}
	iconDescription={state.iconDescription}
	hideCloseButton={state.isHideCloseButton}
	lowContrast={state.isLowContrast}
	kind={state.kind}
	subtitle={state.subtitle}
	timeout={0}
	title={state.title} />;
};
