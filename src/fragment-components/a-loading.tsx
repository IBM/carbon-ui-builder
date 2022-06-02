import React from 'react';
import { Checkbox, Loading, TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/loading.svg';
import { nameStringToVariableString,
	reactClassNamesFromComponentObj,
	angularClassNamesFromComponentObj } from '../utils/fragment-tools';
import { css } from 'emotion';

const overlayStyle = css`
.bx--loading-overlay {
	position: absolute;
};`;

export const ALoadingSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Small'
			id='small'
			checked={selectedComponent.small}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					small: checked
				});
			}}
		/>
        <Checkbox
        labelText='With overlay'
        id='with-overlay'
        checked={selectedComponent.overlay}
        onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					overlay: checked
				});
			}}
		/>
		<Checkbox
		labelText='Active'
		id='active'
		disabled
		checked={selectedComponent.active}
		onChange={(checked: any) => {
			setComponent({
				...selectedComponent,
				active: checked
				});
			}}
		/>
	</>;
};

export const ALoadingCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
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

export const ALoading = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		className={`${componentObj.overlay ? overlayStyle : ''}`}
		headingCss={css`display: block;`}
		{...rest}>
			<Loading
				active={componentObj.active}
				withOverlay={componentObj.overlay}
				small={componentObj.small}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ALoading,
	codeUI: ALoadingCodeUI,
	settingsUI: ALoadingSettingsUI,
	keywords: ['loading'],
	name: 'Loading',
	type: 'loading',
	defaultComponentObj: {
		type: 'loading',
		label: 'Loading',
		overlay: false,
		small: false,
		active: true
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Overlay = ${json.overlay};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Active = ${json.active};`,
			outputs: (_) => '',
			imports: ['LoadingModule'],
			code: ({ json }) => {
				return `<ibm-loading
							[size]="${json.small ? 'sm' : 'normal'}"
							[isActive]="${nameStringToVariableString(json.codeContext?.name)}Active"
                            [overlay]="${nameStringToVariableString(json.codeContext?.name)}Overlay"
                            ${angularClassNamesFromComponentObj(json)}>
                        </ibm-loading>`;
			}
		},
		react: {
			imports: ['Loading'],
			code: ({ json }) => {
				return `<Loading
							active={${json.active}}
                            withOverlay={${json.overlay}}
                            ${json.small ? `small={${json.small}}` : ''}
                            ${reactClassNamesFromComponentObj(json)} />`;
			}
		}
	}
};
