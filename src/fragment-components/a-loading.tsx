import React from 'react';
import {
	Checkbox,
	Loading,
	TextInput,
	Dropdown
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
const overlayStyle = css`
.bx--loading-overlay {
	position: absolute;
};`;

export const ALoadingSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'small', text: 'Small' },
		{ id: 'normal', text: 'Normal' }
	];
	return <>
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			initialSelectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
		<Checkbox
			labelText='With overlay'
			id='with-overlay'
			checked={selectedComponent.overlay}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					overlay: checked
				});
			}} />
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
			}} />
	</>;
};

export const ALoadingCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ALoading = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		className={`${componentObj.overlay ? overlayStyle : ''}`}
		headingCss={css`display: block;`}
		rejectDrop={true}
		{...rest}>
			<Loading
				active={componentObj.active}
				withOverlay={componentObj.overlay}
				small={componentObj.size === 'small'}
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
		size: 'normal',
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
							size="${json.size === 'small' ? 'sm' : 'normal'}"
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
							small={${json.size === 'small'}}
							${reactClassNamesFromComponentObj(json)} />`;
			}
		}
	}
};
