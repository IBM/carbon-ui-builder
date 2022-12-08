import React from 'react';
import {
	RadioButtonGroup,
	RadioButton,
	InlineLoading,
	TextInput,
	NumberInput
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentInfo } from '.';
import { css } from 'emotion';
import image from './../assets/component-icons/inline-loading.svg';
import {
	nameStringToVariableString,
	reactClassNamesFromComponentObj,
	angularClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const AInlineLoadingSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<legend className='bx--label'>Status</legend>
		<RadioButtonGroup
		orientation='vertical'
		name='status-radio-buttons'
		valueSelected={selectedComponent.status}
		onChange={(event: any) => setComponent({
			...selectedComponent,
			status: event
		})}>
			<RadioButton
				id='inactive'
				labelText='Inactive'
				value='inactive' />
			<RadioButton
				id='active'
				labelText='Active'
				value='active' />
			<RadioButton
				id='finished'
				labelText='Finished'
				value='finished' />
			<RadioButton
				id='error'
				labelText='Error'
				value='error' />
		</RadioButtonGroup>
		<TextInput
			value={selectedComponent.activeText}
			labelText='Active text description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				activeText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.inactiveText}
			labelText='Inactive text description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				inactiveText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.errorText}
			labelText='Error text description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				errorText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.successText}
			labelText='Success text description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				successText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.activeIconDescription}
			labelText='Active icon description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				activeIconDescription: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.errorIconDescription}
			labelText='Error icon description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				errorIconDescription: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.finishedIconDescription}
			labelText='Finished icon description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				finishedIconDescription: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.inactiveIconDescription}
			labelText='Inactive icon description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				inactiveIconDescription: event.currentTarget.value
			})} />
		<NumberInput
			id='successDelay'
			min={0}
			label='Success delay (ms)'
			name='successDelay'
			value={selectedComponent.successDelay}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				successDelay: Number(event.imaginaryTarget.value)
			})} />
	</>;
};

export const AInlineLoadingCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	labelText='Input name'
	onChange={(event: any) => setComponent({
		...selectedComponent,
		codeContext: {
			...selectedComponent.codeContext,
			name: event.currentTarget.value
		}
	})}
/>;

export const AInlineLoading = ({
	componentObj,
	...rest
}: any) => {
	const status: any = {
		active: {
			iconDescription: componentObj.activeIconDescription,
			description: componentObj.activeText
		},
		error: {
			iconDescription: componentObj.errorIconDescription,
			description: componentObj.errorText
		},
		inactive: {
			iconDescription: componentObj.inactiveIconDescription,
			description: componentObj.inactiveText
		},
		finished: {
			iconDescription: componentObj.finishedIconDescription,
			description: componentObj.successText
		}
	};

	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		rejectDrop={true}
		{...rest}>
			<InlineLoading
				successDelay={componentObj.successDelay}
				description={status[componentObj.status].description}
				iconDescription={status[componentObj.status].iconDescription}
				status={componentObj.status}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AInlineLoading,
	codeUI: AInlineLoadingCodeUI,
	settingsUI: AInlineLoadingSettingsUI,
	keywords: ['inline', 'loading'],
	name: 'Inline Loading',
	type: 'inline-loading',
	defaultComponentObj: {
		type: 'inline-loading',
		status: 'active'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Status = "${json.status}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}LoadingText = "${json.activeText || 'Loading...'}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}SuccessText = "${json.successText || 'Finished.'}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}ErrorText = "${json.errorText || 'Error!'}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}SuccessDelay = ${json.successDelay === undefined ? 1500 : json.successDelay };`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}OnSuccess = new EventEmitter();`,
			imports: ['InlineLoadingModule'],
			code: ({ json }) => {
				return `<ibm-inline-loading
					(onSuccess)="${nameStringToVariableString(json.codeContext?.name)}OnSuccess.emit($event)"
					[successDelay]="${nameStringToVariableString(json.codeContext?.name)}SuccessDelay"
					[state]="${nameStringToVariableString(json.codeContext?.name)}Status"
					[loadingText]="${nameStringToVariableString(json.codeContext?.name)}LoadingText"
					[successText]="${nameStringToVariableString(json.codeContext?.name)}SuccessText"
					[errorText]="${nameStringToVariableString(json.codeContext?.name)}ErrorText"
					${angularClassNamesFromComponentObj(json)}>
				</ibm-inline-loading>`;
			}
		},
		react: {
			imports: ['InlineLoading'],
			code: ({ json }) => {
				const status = `state["${nameStringToVariableString(json.codeContext?.name)}"] || "${json.status}"`;
				return `<InlineLoading
					onSuccess={() => {
						if (typeof state.${nameStringToVariableString(json.codeContext?.name)}OnSuccess === "function") {
							state.${nameStringToVariableString(json.codeContext?.name)}OnSuccess();
						}
					}}
					successDelay={${json.successDelay}}
					description={${nameStringToVariableString(json.codeContext?.name)}StatusDescription}
					iconDescription={${nameStringToVariableString(json.codeContext?.name)}StatusIconDescription}
					status={${status}}
					${reactClassNamesFromComponentObj(json)} />`;
			},
			additionalCode: (json) => {
				const name = nameStringToVariableString(json.codeContext?.name);
				const status = `${name}Status`;
				const statusDescription = `${name}StatusDescription`;
				const statusIconDescription = `${name}StatusIconDescription`;

				return {
					[status]: `const ${status} = {
						active: {
							iconDescription: "${json.activeIconDescription || 'Loading...'}",
							description: "${json.activeText  || 'Loading...'}"
						},
						error: {
							iconDescription: "${json.errorIconDescription || 'Error!'}",
							description: "${json.errorText || 'Error!'}"
						},
						inactive: {
							iconDescription: "${json.inactiveIconDescription || ''}",
							description: "${json.inactiveText || ''}"
						},
						finished: {
							iconDescription: "${json.finishedIconDescription || 'Finished.'}",
							description: "${json.successText || 'Finished.'}"
						}
					}`,
					[statusDescription]: `const ${statusDescription} = ${status}[state["${name}"] || "${json.status}"].description`,
					[statusIconDescription]: `const ${statusIconDescription} = ${status}[state["${name}"] || "${json.status}"].iconDescription`
				};
			}
		}
	}
};
