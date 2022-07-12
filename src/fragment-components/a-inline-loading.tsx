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
import image from './../assets/component-icons/loading.svg';
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
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			status: event
		});
	}}>
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
	</>;
};

export const AInlineLoadingCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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
	}} />;

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
	type: 'inlineloading',
	defaultComponentObj: {
		type: 'inlineloading',
		status: 'active'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Status = ${json.status};`,
			outputs: (_) => '',
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		},
		react: {
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		}
	}
};
