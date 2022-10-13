import React from 'react';
import {
	Checkbox,
	TextInput,
	Dropdown,
	ToastNotification,
	InlineNotification,
	NotificationActionButton
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/notification.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { css, cx } from 'emotion';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

export const ANotificationSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const kind = [
		{ id: 'error', text: 'Error' },
		{ id: 'info', text: 'Info' },
		{ id: 'info-square', text: 'Info square' },
		{ id: 'success', text: 'Success' },
		{ id: 'warning', text: 'Warning' },
		{ id: 'warning-alt', text: 'Warning alt' }
	];

	const varients = [
		{ id: 'toastNotification', text: 'Toast notification' },
		{ id: 'inlineNotification', text: 'Inline notification' }
	];
	return <>
		<Checkbox
			labelText='Hide close button'
			id='hide-close-button'
			checked={selectedComponent.hideCloseButton}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					hideCloseButton: checked
				});
			}} />
		<Checkbox
			labelText='Low contrast'
			id='low-contrast'
			checked={selectedComponent.lowContrast}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					lowContrast: checked
				});
			}} />
		<Dropdown
			id='varient-selector'
			label='Variant selector'
			titleText='Variant selector'
			items={varients}
			selectedItem={varients.find(item => item.id === selectedComponent.variantSelector)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				variantSelector: event.selectedItem.id
		})} />
		<Dropdown
			id='notification-kind'
			label='Notification kind'
			titleText='Notification kind'
			items={kind}
			selectedItem={kind.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				kind: event.selectedItem.id
		})} />
		<TextInput
			light
			value={selectedComponent.title}
			labelText='Title'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				title: event.currentTarget.value
			})} />
		<TextInput
			light
			value={selectedComponent.link}
			labelText='Link'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				link: event.currentTarget.value
			})} />
		<TextInput
			light
			value={selectedComponent.subtitleText}
			labelText='Subtitle text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				subtitleText: event.currentTarget.value
			})} />
		<TextInput
			light
			value={selectedComponent.iconDescription}
			labelText='Icon description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				iconDescription: event.currentTarget.value
			})} />
		<TextInput
			light
			value={selectedComponent.linkText}
			labelText='Link text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				linkText: event.currentTarget.value
			})} />
		{
			selectedComponent.variantSelector === 'toastNotification'
			? <>
			<TextInput
				light
				value={selectedComponent.captionText}
				labelText='Caption text'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					captionText: event.currentTarget.value
				})} />
			</> :
			<TextInput
				light
				value={selectedComponent.actionButtonText}
				labelText='Action button text'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					actionButtonText: event.currentTarget.value
				})} />
		}
	</>;
};

export const ANotificationCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
		id='input-name'
		value={selectedComponent.codeContext?.name}
		labelText='Input name'
		onChange={(event: any) => {
			setComponent({
				...selectedComponent,
				codeContext: {
					...selectedComponent.codeContext,
					name: event.currentTarget.value
				}
			});
		}}
	/>
};

export const ANotification = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			{
				componentObj.variantSelector === 'toastNotification'
				? <ToastNotification
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				caption={componentObj.captionText}
				iconDescription={componentObj.iconDescription}
				hideCloseButton={componentObj.hideCloseButton}
				lowContrast={componentObj.lowContrast}
				kind={componentObj.kind}
				subtitle=
				{
					<span>
						{componentObj.subtitleText}
						{componentObj.link !== undefined ? <a href={componentObj.link}>{componentObj.linkText}</a> : ''}
					</span>
				}
				timeout={0}
				title={componentObj.title} />
				:  <InlineNotification
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				kind={componentObj.kind}
				actions={
					<NotificationActionButton
					hideCloseButton={componentObj.hideCloseButton}
					lowContrast={componentObj.lowContrast}>
						{componentObj.actionButtonText}
					</NotificationActionButton>
				}
				iconDescription={componentObj.iconDescription}
				subtitle=
				{
					<span>
						{componentObj.subtitleText}
						{componentObj.link !== undefined ? <a href={componentObj.link}>{componentObj.linkText}</a> : ''}
					</span>
				}
				title={componentObj.title} />
			}
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ANotification,
	settingsUI: ANotificationSettingsUI,
	codeUI: ANotificationCodeUI,
	keywords: ['notification'],
	name: 'Notification',
	type: 'notification',
	defaultComponentObj: {
		type: 'notification',
		lowContrast: false,
		hideCloseButton: false,
		kind: 'error',
		variantSelector: 'toastNotification',
		link: '',
		subtitleText: '',
		linkText: '',
		title: '',
		iconDescription: '',
		captionText: '',
		actionButtonText: ''
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => ``,
			outputs: ({ json }) => ``,
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		},
		react: {
			imports: ['Link'],
			code: ({ json }) => {
				return ``;
			}
		}
	}
};
