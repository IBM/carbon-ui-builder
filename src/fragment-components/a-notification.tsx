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
			? <TextInput
				light
				value={selectedComponent.captionText}
				labelText='Caption text'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					captionText: event.currentTarget.value
				})} /> :
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
				: <InlineNotification
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				kind={componentObj.kind}
				hideCloseButton={componentObj.hideCloseButton}
				lowContrast={componentObj.lowContrast}
				actions={
					<NotificationActionButton>
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
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Kind = "${json.kind}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Title = "${json.title}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}SubtitleText = "${json.subtitleText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}CaptionText = "${json.captionText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}LowContrast = ${json.lowContrast};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}ShowClose = ${json.hideCloseButton};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Link = ${json.link};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}LinkText = "${json.linkText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}ActionButtonText = "${json.actionButtonText}";`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ActionClick = new EventEmitter<any>();`,
			imports: ['NotificationModule', 'ButtonModule'],
			code: ({ json }) => {
				return `${json.variantSelector === 'toastNotification'
					? `<ibm-toast
						${angularClassNamesFromComponentObj(json)}
						[notificationObj]="{
							type: "${nameStringToVariableString(json.codeContext?.name)}Kind",
							title: "${nameStringToVariableString(json.codeContext?.name)}Title",
							subtitle: "${json.subtitleText}",
							caption: "${nameStringToVariableString(json.codeContext?.name)}CaptionText",
							lowContrast: ${nameStringToVariableString(json.codeContext?.name)}LowContrast,
							showClose: ${nameStringToVariableString(json.codeContext?.name)}ShowClose,
							links: [
								{
									href: "${nameStringToVariableString(json.codeContext?.name)}Link",
									text: "${nameStringToVariableString(json.codeContext?.name)}LinkText"
								}
							]
						}">
					</ibm-toast>`
					: `<ibm-notification
						${angularClassNamesFromComponentObj(json)}
						[notificationObj]="{
							type: "${nameStringToVariableString(json.codeContext?.name)}Kind",
							title: "${nameStringToVariableString(json.codeContext?.name)}Title",
							message: "${nameStringToVariableString(json.codeContext?.name)}CaptionText",
							showClose: ${nameStringToVariableString(json.codeContext?.name)}ShowClose,
							lowContrast: ${nameStringToVariableString(json.codeContext?.name)}LowContrast,
							actions: [
								{
									text: "${nameStringToVariableString(json.codeContext?.name)}ActionButtonText",
									click: "${nameStringToVariableString(json.codeContext?.name)}ActionClick.emit()"
								}
							];
							links: [
								{
									href: "${nameStringToVariableString(json.codeContext?.name)}Link",
									text: "${nameStringToVariableString(json.codeContext?.name)}LinkText"
								}
							]
						}">
					</ibm-notification>`
				}`;
			}
		},
		react: {
			imports: ['ToastNotification','InlineNotification','NotificationActionButton'],
			code: ({ json }) => {
				return `${json.variantSelector === 'toastNotification'
					? `<ToastNotification
					caption="${json.captionText}"
					iconDescription="${json.iconDescription}"
					hideCloseButton={${json.hideCloseButton}}
					lowContrast={${json.lowContrast}}
					kind="${json.kind}"
					${json.subtitleText || json.link
					? `subtitle=
						{
							<span>
								${json.subtitleText}
								${json.link ? `<a href="${json.link}">${json.linkText}</a>` : ''}
							</span>
						}
					`: ''}
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
					${reactClassNamesFromComponentObj(json)}
					kind="${json.kind}"
					hideCloseButton={${json.hideCloseButton}}
					lowContrast={${json.lowContrast}}
					actions={
						<NotificationActionButton
						onClick={(selectedItem) => handleInputChange({
							target: {
								name: "${nameStringToVariableString(json.codeContext?.name)}",
								value: selectedItem
							}
						})} >
							${json.actionButtonText}
						</NotificationActionButton>
					}
					iconDescription="${json.iconDescription}"
					${json.subtitleText || json.link
					? `subtitle=
						{
							<span>
								${json.subtitleText}
								${json.link ? `<a href="${json.link}">${json.linkText}</a>` : ''}
							</span>
						}
					`: ''}
					title="${json.title}"
					onClose={(selectedItem) => handleInputChange({
						target: {
							name: "${nameStringToVariableString(json.codeContext?.name)}",
							value: selectedItem
						}
					})} />`
				}`;
			}
		}
	}
};
