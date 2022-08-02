import React from 'react';
import { Tooltip,
	TextInput,
	Dropdown
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/link.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const ATooltipSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const alignItems = [
		{ id: 'top', text: 'Top' },
		{ id: 'bottom', text: 'Bottom' },
		{ id: 'left', text: 'Left' },
		{ id: 'right', text: 'Right' }
	];

	return <>
		<Dropdown
			label='Align'
			titleText='Align'
			items={alignItems}
			selectedItem={alignItems.find(item => item.id === selectedComponent.align)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				align: event.selectedItem.id
			})} />

		<TextInput
			value={selectedComponent.description}
			labelText='Description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				description: event.currentTarget.value
			})} />
	</>;
};

export const ATooltipCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
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
		/>
	</>;
};

export const ATooltip = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Tooltip
			label={componentObj.description}
			align={componentObj.align}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{componentObj.description}
			</Tooltip>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATooltip,
	settingsUI: ATooltipSettingsUI,
	codeUI: ATooltipCodeUI,
	keywords: ['tooltip', 'definition'],
	name: 'Tooltip',
	type: 'tooltip',
	defaultComponentObj: {
		type: 'tooltip',
		align: 'top',
		description: 'This is some tooltip text'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => ``,
			outputs: ({ json }) => ``,
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		},
		react: {
			imports: ['Link'],
			code: ({ json }) => {
				return ``;
			}
		}
	}
};
