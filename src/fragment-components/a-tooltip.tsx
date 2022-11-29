import React from 'react';
import {
	Tooltip,
	TextInput,
	Dropdown
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/tooltip.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { css } from 'emotion';

const preventCheckEvent = css`
.bx--tooltip__label {
	pointer-events: none;
}`;

export const ATooltipSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const dropdownDirectionItems = [
		{ id: 'bottom', text: 'Bottom' },
		{ id: 'top', text: 'Top' },
		{ id: 'right', text: 'Right' },
		{ id: 'left', text: 'Left' }
	];

	return <>
		<Dropdown
			id='dropdownDirectionItems'
			label='Select a direction'
			titleText='Direction'
			items={dropdownDirectionItems}
			selectedItem={dropdownDirectionItems.find(item => item.id === selectedComponent.direction)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				direction: event.selectedItem.id
			})} />
		<TextInput
			value={selectedComponent.description}
			labelText='Description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				description: event.currentTarget.value
			})} />
		<TextInput
			value={selectedComponent.triggerText}
			labelText='Trigger text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				triggerText: event.currentTarget.value
			})} />
	</>;
};

export const ATooltipCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const ATooltip = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		className={`${preventCheckEvent} ${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} `}
		{...rest}>
			<Tooltip
			direction={componentObj.direction}
			description={componentObj.description}
			triggerText={componentObj.triggerText}
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
		direction: 'top',
		description: 'This is some tooltip text',
		triggerText: 'Tooltip label'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Description = "${json.description}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}TriggerText = "${json.triggerText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Direction = "${json.direction}";`,
			outputs: (_) => '',
			imports: ['DialogModule, PlaceholderModule, TagModule, IconModule'],
			code: ({ json }) => {
				return `<div class="bx--tooltip__label">
					{{${nameStringToVariableString(json.codeContext?.name)}TriggerText}}
					<span
						${angularClassNamesFromComponentObj(json)}
						[ibmTooltip]="${nameStringToVariableString(json.codeContext?.name)}Description"
						trigger="click"
						[placement]="${json.direction ? `${nameStringToVariableString(json.codeContext?.name)}Direction` : 'top'}">
						<div role="button">
							<svg ibmIcon="information--filled" size="16"></svg>
						</div>
					</span>
				</div>
				<ibm-placeholder></ibm-placeholder>`;
			}
		},
		react: {
			imports: ['Tooltip'],
			code: ({ json }) => {
				return `<Tooltip
					${reactClassNamesFromComponentObj(json)}
					description="${json.description}"
					className="tooltip-trigger"
					triggerText="${json.triggerText}"
					${json.direction ? `direction="${json.direction}"` : ''}>
						${json.description}
					</Tooltip>`;
			}
		}
	}
};
