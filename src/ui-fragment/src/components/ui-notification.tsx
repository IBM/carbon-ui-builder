import React from 'react';
import {
	InlineNotification,
	ToastNotification,
	NotificationActionButton
} from 'carbon-components-react';
import { CssClasses } from '../types';

export interface NotificationState {
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

export const UINotification = ({ state }: {
	state: NotificationState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
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
			caption={state.captionText}
			iconDescription={state.iconDescription}
			hideCloseButton={state.hideCloseButton}
			lowContrast={state.lowContrast}
			kind={state.kind}
			subtitle=
			{
				<span>
					{state.subtitleText}
					{state.link !== undefined ? <a href={state.link}>{state.linkText}</a> : ''}
				</span>
			}
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
			subtitle=
			{
				<span>
					{state.subtitleText}
					{state.link !== undefined ? <a href={state.link}>{state.linkText}</a> : ''}
				</span>
			}
			title={state.title} />
		}
	</>;
};
