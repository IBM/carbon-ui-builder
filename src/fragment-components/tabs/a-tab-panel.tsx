import React from 'react';
import { TextInput } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import image from '../../assets/component-icons/link.svg';

export const ATabPanelSettingsUI = () => {};

export const ATabPanelCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const ATabPanel = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATabPanel,
	settingsUI: ATabPanelSettingsUI,
	codeUI: ATabPanelCodeUI,
	render: ({ componentObj, select, remove, selected }) => <ATabPanel
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
	</ATabPanel>,
	keywords: ['tab', 'panel'],
	name: 'Tab panel',
	type: 'tab-panel',
	defaultComponentObj: {
		type: 'tab-panel'
	},
	image,
	hideFromElementsPane: true,
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: () => '',
			imports: [''],
			code: () => {
				return '';
			}
		},
		react: {
			imports: [''],
			code: () => {
				return '';
			}
		}
	}
};
