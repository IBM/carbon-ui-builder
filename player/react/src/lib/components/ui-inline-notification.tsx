import React from 'react';
import { CssClasses, SendSignal } from '../types';
import { InlineNotification } from '@carbon/react';

import { commonSlots, slotsDisabled } from '../common-slots';

export interface InlineNotificationState {
	id: string;
	type: string;
	lowContrast?: boolean;
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

export const type = 'inline-notification';

export const signals = ['valueChange', 'click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	lowContrast: 'boolean',
	setLowContrast: (state: InlineNotificationState) => ({
		...state,
		lowContrast: true
	}),
	setHighContrast: (state: InlineNotificationState) => ({
		...state,
		lowContrast: false
	}),
	toggleContrast: (state: InlineNotificationState) => ({
		...state,
		lowContrast: !state.lowContrast
	}),
	hideCloseButton: 'boolean',
	toHideCloseButton: (state: InlineNotificationState) => ({
		...state,
		hideCloseButton: true
	}),
	toShowCloseButton: (state: InlineNotificationState) => ({
		...state,
		hideCloseButton: false
	}),
	toggleCloseButton: (state: InlineNotificationState) => ({
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

export const UIInlineNotification = ({ state, sendSignal }: {
	state: InlineNotificationState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'inline-notification') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <InlineNotification
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
		kind={state.kind}
		iconDescription={state.iconDescription}
		subtitle= {state.subtitle}
		title={state.title} />;
};
