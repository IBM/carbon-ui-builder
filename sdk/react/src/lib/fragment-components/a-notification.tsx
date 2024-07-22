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
			checked={selectedComponent.isHideCloseButton}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					isHideCloseButton: checked
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
			value={selectedComponent.subtitle}
			labelText='Subtitle text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				subtitle: event.currentTarget.value
			})} />
		{
			selectedComponent.variant === 'toastNotification' && <TextInput
			light
			value={selectedComponent.caption}
			labelText='Caption text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				caption: event.currentTarget.value
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
				caption={componentObj.caption}
				hideCloseButton={componentObj.isHideCloseButton}
				lowContrast={componentObj.lowContrast}
				kind={componentObj.kind}
				subtitle={componentObj.subtitle}
				timeout={0}
				title={componentObj.title} />
					: <InlineNotification
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				kind={componentObj.kind}
				hideCloseButton={componentObj.isHideCloseButton}
				lowContrast={componentObj.lowContrast}
				subtitle={componentObj.subtitle}
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
		type: 'notification'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}notificationObj: any = {
					type: "${json.kind ? json.kind : 'error'}",
					title: "${json.title ? json.title : ''}",
					${json.variant === 'toastNotification' ? `subtitle: "${json.subtitle ? json.subtitle : ''}",` : ''}
					${json.variant === 'toastNotification' ?
						`caption: "${json.caption ? json.caption : ''}",` : `message: "${json.caption ? json.caption : ''}",`}
					lowContrast:${json.lowContrast ? json.lowContrast : false},
					showClose: ${json.isHideCloseButton ? json.isHideCloseButton : false}
				};`,
				outputs: () => '',
				imports: ['NotificationModule', 'ButtonModule'],
				code: ({ json }) => {
					return `${json.variant === 'toastNotification'
						? `<cds-toast
					${angularClassNamesFromComponentObj(json)}
					[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}notificationObj">
					</cds-toast>`
						: `<cds-inline-notification
					${angularClassNamesFromComponentObj(json)}
					[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}notificationObj">
					</cds-inline-notification>`
					}`;
				}
			},
			v10: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}notificationObj: any = {
					type: "${json.kind ? json.kind : 'error'}",
					title: "${json.title ? json.title : ''}",
					${json.variant === 'toastNotification' ? `subtitle: "${json.subtitle ? json.subtitle : ''}",` : ''}
					${json.variant === 'toastNotification' ?
						`caption: "${json.caption ? json.caption : ''}",` : `message: "${json.caption ? json.caption : ''}",`}
					lowContrast:${json.lowContrast ? json.lowContrast : false},
					showClose: ${json.isHideCloseButton ? json.isHideCloseButton : false}
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
						caption="${json.caption}"
						hideCloseButton={${json.isHideCloseButton}}
						lowContrast={${json.lowContrast}}
						kind="${json.kind}"
						${json.subtitle ? `subtitle= { <span> ${json.subtitle} </span> }`: ''}
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
						hideCloseButton={${json.isHideCloseButton}}
						lowContrast={${json.lowContrast}}
						${json.subtitle ? `subtitle= { <span> ${json.subtitle} </span> }`: ''}
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
						caption="${json.caption}"
						hideCloseButton={${json.isHideCloseButton}}
						lowContrast={${json.lowContrast}}
						kind="${json.kind}"
						${json.subtitle ? `subtitle= { <span> ${json.subtitle} </span> }`: ''}
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
						hideCloseButton={${json.isHideCloseButton}}
						lowContrast={${json.lowContrast}}
						${json.subtitle ? `subtitle= { <span> ${json.subtitle} </span> }`: ''}
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
