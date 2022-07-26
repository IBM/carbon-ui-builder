import React from 'react';
import {
	RadioButtonGroup,
	RadioButton,
	InlineLoading,
	TextInput
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
		<legend className="bx--label">Status</legend>
		<RadioButtonGroup
			orientation="vertical"
			name="status-radio-buttons"
			valueSelected={selectedComponent.status}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				status: event
			})} >
			<RadioButton
			id="inactive"
			labelText="Inactive"
			value="inactive"
			/>
			<RadioButton
			id="active"
			labelText="Active"
			value="active"
			/>
			<RadioButton
			id="finished"
			labelText="Finished"
			value="finished"
			/>
			<RadioButton
			id="error"
			labelText="Error"
			value="error"
			/>
		</RadioButtonGroup>
		<TextInput
			value={selectedComponent.textDescription}
			labelText='Loading text description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				textDescription: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.iconDescription}
			labelText='Icon description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				iconDescription: event.currentTarget.value
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
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		rejectDrop={true}
		{...rest}>
			<InlineLoading
				description={componentObj.textDescription}
				status={componentObj.status}
				iconDescription={componentObj.iconDescription}
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
	type: 'inlineloading',
	defaultComponentObj: {
		type: 'inlineloading',
		status: 'active',
		textDescription: 'Loading data',
		iconDescription: 'Loading'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Status = "${json.status}";`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}OnSuccess = new EventEmitter();`,
			imports: ['InlineLoadingModule'],
			code: ({ json }) => {
				return `<ibm-inline-loading
							(onSuccess)="${nameStringToVariableString(json.codeContext?.name)}OnSuccess.emit($event)"
							[state]="${nameStringToVariableString(json.codeContext?.name)}Status"
							${json.status === 'active' ? `[loadingText]="'${json.textDescription}'"`: ''}
							${json.status === 'finished' ? `[successText]="'${json.textDescription}'"`: ''}
							${json.status === 'error' ? `[errorText]="'${json.textDescription}'"`: ''}
							${angularClassNamesFromComponentObj(json)}>
						</ibm-inline-loading>`;
			}
		},
		react: {
			imports: ['InlineLoading'],
			code: ({ json }) => {
				return `<InlineLoading
							(onSuccess)="${nameStringToVariableString(json.codeContext?.name)}OnSuccess.emit($event)"
							description="${json.textDescription}"
							iconDescription="${json.iconDescription}"
							status="${json.status}"
							${reactClassNamesFromComponentObj(json)} />`;
			}
		}
	}
};
