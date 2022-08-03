import React from 'react';
import {
	Tooltip,
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
import { css } from 'emotion';

const preventCheckEvent = css`
.bx--tooltip__label {
	pointer-events: none;
}`;

export const ATooltipSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const alignItems = [
		{ id: 'bottom', text: 'Bottom' },
		{ id: 'top', text: 'Top' },
		{ id: 'right', text: 'Right' },
		{ id: 'left', text: 'Left' }
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
		align: 'bottom',
		description: 'This is some tooltip text'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Description = "${json.description}";`,
			outputs: (_) => '',
			imports: ['DialogModule, PlaceholderModule, TagModule, IconModule'],
			code: ({ json }) => {
				return `
				<div class="bx--tooltip__label">
					<span
						${angularClassNamesFromComponentObj(json)}
						[ibmTooltip]="${nameStringToVariableString(json.codeContext?.name)}Description"
						trigger="click"
						[placement]="'${json.align}'" >
						<div role="button">
							<svg id="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
								<path d="M8.5 11L8.5 6.5 6.5 6.5 6.5 7.5 7.5 7.5 7.5 11 6 11 6 12 10 12 10 11zM8 3.5c-.4 0-.8.3-.8.8S7.6 5 8 5c.4 0 .8-.3.8-.8S8.4 3.5 8 3.5z"/>
								<path d="M8,15c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S11.9,15,8,15z M8,2C4.7,2,2,4.7,2,8s2.7,6,6,6s6-2.7,6-6S11.3,2,8,2z"/>
							</svg>
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
					label="${json.description}"
					align="${json.align}">
						${json.description}
					</Tooltip>`;
			}
		}
	}
};
