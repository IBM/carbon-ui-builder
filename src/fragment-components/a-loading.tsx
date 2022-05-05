/* eslint-disable react/jsx-indent-props */
import React from 'react';
import { Checkbox, Loading } from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/checkbox.svg';
import { nameStringToVariableString,
	reactClassNamesFromComponentObj,
	angularClassNamesFromComponentObj } from '../utils/fragment-tools';
import { css } from 'emotion';

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
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>;
};

export const ALoading = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
            componentObj={componentObj}
            headingCss={css`display: block;`}
            {...rest}>
			<Loading
                withOverlay={false}
				small={componentObj.small}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ALoading,
	settingsUI: ALoadingSettingsUI,
	keywords: ['loading'],
	name: 'Loading',
	type: 'loading',
	defaultComponentObj: {
		type: 'loading',
		label: 'Loading',
		overlay: false,
		small: false
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Overlay: boolean = "${json.overlay}";`,
			outputs: (_) => '',
			imports: ['LoadingModule'],
			code: ({ json }) => {
				return `<ibm-loading 
                                [size]="${json.small ? 'sm' : 'normal'}"
                                [overlay]="${nameStringToVariableString(json.codeContext?.name)}Overlay"
                                ${angularClassNamesFromComponentObj(json)}>
                        </ibm-loading>`;
			}
		},
		react: {
			imports: ['Loading'],
			code: ({ json }) => {
				return `<Loading
                            withOverlay={${json.overlay}}
                            ${json.small ? `small={${json.small}}` : ''}
                            ${reactClassNamesFromComponentObj(json)} />`;
			}
		}
	}
};
