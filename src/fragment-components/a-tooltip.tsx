import React from 'react';
import {
	Tooltip,
	TextInput,
	Dropdown,
	Checkbox
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
	const dropdownAlignItems = [
		{ id: 'bottom', text: 'Bottom' },
		{ id: 'top', text: 'Top' },
		{ id: 'right', text: 'Right' },
		{ id: 'left', text: 'Left' }
	];

	return <>
		<Dropdown
			label='Align'
			titleText='Align'
			items={dropdownAlignItems}
			selectedItem={dropdownAlignItems.find(item => item.id === selectedComponent.align)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				align: event.selectedItem.id
			})} />
		<TextInput
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
<<<<<<< HEAD
				label: event.currentTarget.value
		})} />
=======
				description: event.currentTarget.value
			})} />
>>>>>>> 170acc2fc24adab3a8a76d95f8d310dd5cbb15cb
		<TextInput
			value={selectedComponent.triggerText}
			labelText='Trigger text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				triggerText: event.currentTarget.value
			})} />
		<Checkbox
			labelText='Is open'
			id='is-open'
			checked={selectedComponent.isOpen}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					isOpen: checked
				});
			}} />
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
			label={componentObj.label}
			direction={componentObj.align}
			triggerText={componentObj.triggerText}
			open={componentObj.isOpen}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{componentObj.label}
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
		align: 'bottom',
		label: 'This is some tooltip text',
		triggerText: 'Tooltip label',
		isOpen: false
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Label = "${json.label}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}TriggerText = "${json.triggerText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}isOpen = ${json.isOpen};`,
			outputs: (_) => '',
			imports: ['DialogModule, PlaceholderModule, TagModule, IconModule'],
			code: ({ json }) => {
				return `<div class="bx--tooltip__label">
					{{${nameStringToVariableString(json.codeContext?.name)}TriggerText}}
					<span
						${angularClassNamesFromComponentObj(json)}
						[ibmTooltip]="${nameStringToVariableString(json.codeContext?.name)}Label"
						trigger="click"
						[isOpen]=${nameStringToVariableString(json.codeContext?.name)}isOpen
						[placement]="'${json.align}'" >
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
					label="${json.label}"
					triggerText="${json.triggerText}"
					open={${json.isOpen}}
					direction="${json.align}">
						${json.label}
					</Tooltip>`;
			}
		}
	}
};
