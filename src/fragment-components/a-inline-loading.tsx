import React from 'react';
import {
	Accordion,
	AccordionItem,
	InlineLoading,
	TextInput,
	Dropdown,
	NumberInput
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentInfo } from '.';
import { css, cx } from 'emotion';
import image from './../assets/component-icons/inline-loading.svg';
import {
	nameStringToVariableString,
	reactClassNamesFromComponentObj,
	angularClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { styleObjectToString } from '../ui-fragment/src/utils';

export const AInlineLoadingSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const statusItems = [
		{ id: 'inactive', text: 'Inactive' },
		{ id: 'active', text: 'Active' },
		{ id: 'finished', text: 'Finished' },
		{ id: 'error', text: 'Error' }
	];
	return <>
		<Dropdown
			id='combobox-status-dropdown'
			label='Status'
			titleText='Status'
			items={statusItems}
			selectedItem={statusItems.find(item => item.id === selectedComponent.status)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				status: event.selectedItem.id
			})} />
		<TextInput
			value={selectedComponent.activeText}
			labelText='Active text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				activeText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.inactiveText}
			labelText='Inactive text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				inactiveText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.errorText}
			labelText='Error text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				errorText: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.successText}
			labelText='Success text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				successText: event.currentTarget.value
			})} />
		<NumberInput
			id='successDelay'
			min={0}
			label='Success delay (ms)'
			name='successDelay'
			value={selectedComponent.successDelay}
			step={100}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				successDelay: Number(event.imaginaryTarget.value)
			})} />
		<Accordion align='start'>
			<AccordionItem title='Icon descriptions'>
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
			</AccordionItem>
		</Accordion>
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
	})} />;

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
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`
				)} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AInlineLoading,
	codeUI: AInlineLoadingCodeUI,
	settingsUI: AInlineLoadingSettingsUI,
	keywords: ['inline', 'loading'],
	name: 'Inline loading',
	type: 'inline-loading',
	defaultComponentObj: {
		type: 'inline-loading',
		status: 'active',
		activeText: 'Loading...',
		successText: 'Finished.',
		errorText: 'Error!'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Status = "${json.status}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}LoadingText = "${json.activeText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}SuccessText = "${json.successText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}ErrorText = "${json.errorText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}SuccessDelay = ${json.successDelay === undefined ?
					1500 : json.successDelay };`,
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
							description: "${json.activeText || 'Loading...'}"
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
