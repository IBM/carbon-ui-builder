import React from 'react';
import { CssClasses } from '../types';
import {
	ToastNotification,
	InlineNotification,
	NotificationActionButton
} from '@carbon/react';

import { commonSlots, slotsDisabled } from '../common-slots';
import { SendSignal } from '../types';

export interface NotificationState {
	id: string,
	type: string;
	lowContrast?: boolean;
	hideCloseButton?: boolean;
	kind?: string;
	variantSelector?: string;
	link?: string;
	subtitleText?: string;
	linkText?: string;
	title?: string;
	iconDescription?: string;
	captionText?: string;
	actionButtonText?: string;
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
		hideCloseButton: !state.hideCloseButton
	}),
	type: 'string',
	kind: 'string',
	variantSelector: 'string',
	link: 'string',
	subtitleText: 'string',
	linkText: 'string',
	title: 'string',
	iconDescription: 'string',
	captionText: 'string',
	actionButtonText: 'string'
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
			state.variantSelector === 'toastNotification'
				? <ToastNotification
			className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
			onClick={() => {
				sendSignal(state.id, 'click');
			}}
			onChange={(event: any) => {
				sendSignal(state.id, 'valueChange', [event.value], { ...state, value: event.value });
			}}
			caption={state.captionText}
			iconDescription={state.iconDescription}
			hideCloseButton={state.hideCloseButton}
			lowContrast={state.lowContrast}
			kind={state.kind}
			subtitle={state.subtitleText}
			timeout={0}
			title={state.title} />
				: <InlineNotification
			className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
			kind={state.kind}
			actions={
				<NotificationActionButton
				hideCloseButton={state.hideCloseButton}
				lowContrast={state.lowContrast}>
					{state.actionButtonText}
				</NotificationActionButton>
			}
			iconDescription={state.iconDescription}
			subtitle= {state.subtitleText}
			title={state.title} />
		}
	</>;
};
