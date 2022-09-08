import React, { useRef } from 'react';
import { TextInput, Tab } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import image from '../../assets/component-icons/link.svg';

export const ATabSettingsUI = () => { return <></>};

export const ATabCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const ATab = ({
	componentObj,
	children,
	selected,
	outline,
	...rest
}: any) => {
	return (
		<AComponent
			componentObj={componentObj}
			selected={selected}
			{...rest}>
			<Tab
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
			label={componentObj.labelText}
			disabled={componentObj.disabled}>
				{children}
			</Tab>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATab,
	settingsUI: ATabSettingsUI,
	codeUI: ATabCodeUI,
	render: ({ componentObj, select, remove, selected }) => <ATab
			componentObj={componentObj}
			select={select}
			remove={remove}
			selected={selected}>
	</ATab>,
	keywords: ['tab'],
	name: 'Tab',
	type: 'tab',
	defaultComponentObj: {
		type: 'tab',
		items: []
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

