import React from 'react';
import { CssClasses, SendSignal } from '../types';
import {
	ToastNotification,
	InlineNotification
} from '@carbon/react';

import { commonSlots, slotsDisabled } from '../common-slots';

export interface NotificationState {
	id: string;
	type: string;
	lowContrast?: boolean;
	isHideCloseButton?: boolean;
	kind?: string;
	variant?: string;
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
	lowContrast: 'boolean',
	isLowContrast: (state: NotificationState) => ({
		...state,
		lowContrast: true
	}),
	isNotLowContrast: (state: NotificationState) => ({
		...state,
		lowContrast: false
	}),
	toggleIsLowContrast: (state: NotificationState) => ({
		...state,
		lowContrast: !state.lowContrast
	}),
	hideCloseButton: 'boolean',
	isHideCloseButton: (state: NotificationState) => ({
		...state,
		hideCloseButton: true
	}),
	isShowCloseButton: (state: NotificationState) => ({
		...state,
		hideCloseButton: false
	}),
	toggleCloseButton: (state: NotificationState) => ({
		...state,
		hideCloseButton: !state.isHideCloseButton
	}),
	type: 'string',
	kind: 'string',
	variant: 'string',
	link: 'string',
	subtitle: 'string',
	linkText: 'string',
	title: 'string',
	iconDescription: 'string',
	caption: 'string'
};

export const UINotification = ({ state, sendSignal }: {
	state: NotificationState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'notification') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <>
		{
			state.variant === 'toastNotification'
				? <ToastNotification
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
			lowContrast={state.lowContrast}
			kind={state.kind}
			subtitle={state.subtitle}
			timeout={0}
			title={state.title} />
				: <InlineNotification
			className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
			kind={state.kind}
			iconDescription={state.iconDescription}
			subtitle= {state.subtitle}
			title={state.title} />
		}
	</>;
};
