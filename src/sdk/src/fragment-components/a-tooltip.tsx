import React from 'react';
import {
	Dropdown,
	Tooltip,
	TextInput
} from 'carbon-components-react';
import { css } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/tooltip.svg';
import { angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../tools';
import { styleObjectToString } from '../../../ui-fragment/src/utils';

const preventCheckEvent = css`
	.bx--tooltip__label {
		pointer-events: none;
	}`;

export const ATooltipSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const placements = [
		{ id: 'bottom', text: 'Bottom' },
		{ id: 'top', text: 'Top' },
		{ id: 'left', text: 'Left' },
		{ id: 'right', text: 'Right' }
	];

	const alignments = [
		{ id: 'start', text: 'Start' },
		{ id: 'center', text: 'Center' },
		{ id: 'end', text: 'End' }
	];

	return <>
		<Dropdown
			id='placement'
			label='Placement of the pop up'
			titleText='Placement'
			items={placements}
			selectedItem={placements.find(item => item.id === selectedComponent.placement)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				placement: event.selectedItem.id
			})} />
		<Dropdown
			id='alignment'
			label='Alignment the text'
			titleText='Alignment'
			items={alignments}
			selectedItem={alignments.find(item => item.id === selectedComponent.alignment)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				alignment: event.selectedItem.id
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

export const ATooltipCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	id='input-name'
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

export const ATooltip = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		// make the icon hover only and whatever other customer css classes to be augmented
		className={`${preventCheckEvent} ${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} `}
		{...rest}>
			<Tooltip
				className={css`${styleObjectToString(componentObj.style)}`}
				triggerText={componentObj.triggerText}
				direction={componentObj.placement}
				align={componentObj.alignment}>
					{componentObj.description}
			</Tooltip>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATooltip,
	settingsUI: ATooltipSettingsUI,
	codeUI: ATooltipCodeUI,
	render: ({ componentObj, select, remove, selected }) => <ATooltip
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected} />,
	keywords: ['tooltip'],
	name: 'Tooltip',
	type: 'tooltip',
	defaultComponentObj: {
		type: 'tooltip'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Description = "${json.description}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}TriggerText = "${json.triggerText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Direction = "${json.placement}";`,
			outputs: () => '',
			imports: ['TooltipModule'],
			code: ({ json }) => `<div class="bx--tooltip__label">
				{{${nameStringToVariableString(json.codeContext?.name)}TriggerText}}
				<span
					${angularClassNamesFromComponentObj(json)}
					[ibmTooltip]="${nameStringToVariableString(json.codeContext?.name)}Description"
					trigger="click"
					${json.placement ? `[placement]='${nameStringToVariableString(json.codeContext?.name)}Direction` : ''}>
					<div role="button">
						<svg ibmIcon="information--filled" size="16"></svg>
					</div>
				</span>
			</div>`
		},
		react: {
			imports: ['Tooltip'],
			code: ({ json }) => `<Tooltip
					${reactClassNamesFromComponentObj(json)}
					description="${json.description}"
					className="tooltip-trigger"
					triggerText="${json.triggerText}"
					${json.alignment ? `align="${json.alignment}"` : ''}
					${json.placement ? `direction="${json.placement}"` : ''}>
						${json.description}
				</Tooltip>`
		}
	}
};
