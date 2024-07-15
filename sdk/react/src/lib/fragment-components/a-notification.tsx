import React from 'react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/notification.svg';
import { css, cx } from 'emotion';
import {
	Dropdown,
	Checkbox,
	TextInput,
	ToastNotification,
	InlineNotification
} from '@carbon/react';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';

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
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					hideCloseButton: checked
				});
			}} />
		<Checkbox
			labelText='Low contrast'
			id='low-contrast'
			checked={selectedComponent.lowContrast}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					lowContrast: checked
				});
			}} />
		<Dropdown
			id='varient-selector'
			label='Variant'
			titleText='Variant'
			items={varients}
			selectedItem={varients.find(item => item.id === selectedComponent.variant)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					variant: event.selectedItem.id
				});
			}} />
		<Dropdown
			id='notification-kind'
			label='Notification kind'
			titleText='Notification kind'
			items={kind}
			selectedItem={kind.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					kind: event.selectedItem.id
				});
			}} />
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
			value={selectedComponent.subtitleText}
			labelText='Subtitle text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				subtitleText: event.currentTarget.value
			})} />
		{
			selectedComponent.variant === 'toastNotification' && <TextInput
			light
			value={selectedComponent.captionText}
			labelText='Caption text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				captionText: event.currentTarget.value
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
	/>;
};

export const ANotification = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			{
				componentObj.variant === 'toastNotification'
					? <ToastNotification
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				caption={componentObj.captionText}
				hideCloseButton={componentObj.hideCloseButton}
				lowContrast={componentObj.lowContrast}
				kind={componentObj.kind}
				subtitle={componentObj.subtitleText}
				timeout={0}
				title={componentObj.title} />
					: <InlineNotification
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				kind={componentObj.kind}
				hideCloseButton={componentObj.hideCloseButton}
				lowContrast={componentObj.lowContrast}
				subtitle={componentObj.subtitleText}
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
		variant: 'toastNotification',
		link: '',
		subtitleText: '',
		linkText: '',
		title: '',
		captionText: ''
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}notificationObj: any = {
					type: "${json.kind}",
					title: "${json.title}",
					${json.variant === 'toastNotification' ? `subtitle: "${json.subtitleText}",` : ''}
					${json.variant === 'toastNotification' ? `caption: "${json.captionText}",` : `message: "${json.captionText}",`}
					lowContrast:${json.lowContrast},
					showClose: ${!json.hideCloseButton}
				};`,
				outputs: () => '',
				imports: ['NotificationModule', 'ButtonModule'],
				code: ({ json }) => {
					return `${json.variant === 'toastNotification'
							? `<ibm-toast
						${angularClassNamesFromComponentObj(json)}
						[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}notificationObj">
						</ibm-toast>`
							: `<ibm-notification
						${angularClassNamesFromComponentObj(json)}
						[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}notificationObj">
						</ibm-notification>`
					}`;
				}
			},
			v10: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}notificationObj: any = {
					type: "${json.kind}",
					title: "${json.title}",
					${json.variant === 'toastNotification' ? `subtitle: "${json.subtitleText}",` : ''}
					${json.variant === 'toastNotification' ? `caption: "${json.captionText}",` : `message: "${json.captionText}",`}
					lowContrast:${json.lowContrast},
					showClose: ${!json.hideCloseButton}
				};`,
				outputs: () => '',
				imports: ['NotificationModule', 'ButtonModule'],
				code: ({ json }) => {
					return `${json.variant === 'toastNotification'
							? `<ibm-toast
						${angularClassNamesFromComponentObj(json)}
						[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}notificationObj">
						</ibm-toast>`
							: `<ibm-notification
						${angularClassNamesFromComponentObj(json)}
						[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}notificationObj">
						</ibm-notification>`
					}`;
				}
			}
		},
		react: {
			latest: {
				imports: ['ToastNotification','InlineNotification'],
				code: ({ json }) => {
					return `${json.variant === 'toastNotification'
							? `<ToastNotification
						caption="${json.captionText}"
						hideCloseButton={${json.hideCloseButton}}
						lowContrast={${json.lowContrast}}
						kind="${json.kind}"
						${json.subtitleText ? `subtitle= { <span> ${json.subtitleText} </span> }`: ''}
						timeout={${0}}
						title="${json.title}"
						onClose={(selectedItem) => handleInputChange({
							target: {
								name: "${nameStringToVariableString(json.codeContext?.name)}",
								value: selectedItem
							}
						})}
						${reactClassNamesFromComponentObj(json)} />`
							: `<InlineNotification
						kind="${json.kind}"
						hideCloseButton={${json.hideCloseButton}}
						lowContrast={${json.lowContrast}}
						${json.subtitleText ? `subtitle= { <span> ${json.subtitleText} </span> }`: ''}
						title="${json.title}"
						onClose={(selectedItem) => handleInputChange({
							target: {
								name: "${nameStringToVariableString(json.codeContext?.name)}",
								value: selectedItem
							}
						})}
						${reactClassNamesFromComponentObj(json)} />`
					}`;
				}
			},
			v10: {
				imports: ['ToastNotification','InlineNotification'],
				code: ({ json }) => {
					return `${json.variant === 'toastNotification'
							? `<ToastNotification
						caption="${json.captionText}"
						hideCloseButton={${json.hideCloseButton}}
						lowContrast={${json.lowContrast}}
						kind="${json.kind}"
						${json.subtitleText ? `subtitle= { <span> ${json.subtitleText} </span> }`: ''}
						timeout={${0}}
						title="${json.title}"
						onClose={(selectedItem) => handleInputChange({
							target: {
								name: "${nameStringToVariableString(json.codeContext?.name)}",
								value: selectedItem
							}
						})}
						${reactClassNamesFromComponentObj(json)} />`
							: `<InlineNotification
						kind="${json.kind}"
						hideCloseButton={${json.hideCloseButton}}
						lowContrast={${json.lowContrast}}
						${json.subtitleText ? `subtitle= { <span> ${json.subtitleText} </span> }`: ''}
						title="${json.title}"
						onClose={(selectedItem) => handleInputChange({
							target: {
								name: "${nameStringToVariableString(json.codeContext?.name)}",
								value: selectedItem
							}
						})}
						${reactClassNamesFromComponentObj(json)} />`
					}`;
				}
			}
		}
	}
};
