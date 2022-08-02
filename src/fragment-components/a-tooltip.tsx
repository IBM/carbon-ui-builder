import React from 'react';
import {
	Tooltip,
	Checkbox,
	TextInput,
	Dropdown,
	DefinitionTooltip
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

	const definitionTooltipAlign = [
		{ id: 'top', text: 'Top' },
		{ id: 'bottom', text: 'Bottom' }
	];

	return <>
		<Dropdown
			label='Align'
			titleText='Align'
			items={selectedComponent.definitionTooltip ? definitionTooltipAlign : alignItems}
			selectedItem={alignItems.find(item => item.id === selectedComponent.align)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				align: event.selectedItem.id
			})} />
		<Checkbox
			labelText='Definition tooltip'
			id='definition-tooltip'
			checked={selectedComponent.definitionTooltip}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				definitionTooltip: checked
		})} />
		<TextInput
			value={selectedComponent.description}
			labelText='Description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				description: event.currentTarget.value
			})} />
		{
			selectedComponent.definitionTooltip && <TextInput
				value={selectedComponent.definitionTooltipText}
				labelText='Trigger text'
				onChange={(event: any) => setComponent({
					...selectedComponent,
					definitionTooltipText: event.currentTarget.value
			})} />
		}
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
		{
			componentObj.definitionTooltip ?
			<DefinitionTooltip
			align={componentObj.align}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
			definition={componentObj.description}>
				{componentObj.definitionTooltipText}
		  	</DefinitionTooltip> :
			<Tooltip
			label={componentObj.description}
			align={componentObj.align}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{componentObj.description}
			</Tooltip>
		}
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
		definitionTooltip: false,
		definitionTooltipText: 'Definition Tooltip',
		description: 'This is some tooltip text'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => ``,
			outputs: ({ json }) => ``,
			imports: ['DialogModule, PlaceholderModule, TagModule'],
			code: ({ json }) => {
				return `${json.definitionTooltip ?
					`<ibm-tooltip-definition
						[content]="${json.description}"
						[placement]="${json.align}"
						{{${json.definitionTooltipText}}}
					</ibm-tooltip-definition>` :
					`<div class="bx--tooltip__label">
					<span
						[ibmTooltip]="${json.description}"
						trigger="click"
						[placement]="${json.align}">
						<div role="button">
							<svg ibmIcon="information--filled" size="16"></svg>
						</div>
					</span>
				</div>
				<ibm-placeholder></ibm-placeholder>`}`;
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
