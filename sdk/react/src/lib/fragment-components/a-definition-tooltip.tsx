import React from 'react';
import {
	Dropdown,
	DefinitionTooltip,
	TextInput,
	Checkbox
} from '@carbon/react';
import { css } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/tooltip.svg';
import {
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';

const preventCheckEvent = css`
	pointer-events: none;
`;

export const ADefinitionTooltipSettingsUI = ({ selectedComponent, setComponent }: any) => {

	const alignments = [
		{ id: 'top', text: 'Top' },
		{ id: 'top-left', text: 'Top left' },
		{ id: 'top-right', text: 'Top right' },
		{ id: 'bottom', text: 'Bottom' },
		{ id: 'bottom-left', text: 'Bottom left' },
		{ id: 'bottom-right', text: 'Bottom right' },
		{ id: 'left', text: 'Left' },
		{ id: 'left-bottom', text: 'Left bottom' },
		{ id: 'left-top', text: 'Left top' },
		{ id: 'right', text: 'Right' },
		{ id: 'right-bottom', text: 'Right bottom' },
		{ id: 'right-top', text: 'Right top' }
	];

	return <>
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
			id='description'
			value={selectedComponent.description}
			labelText='Description'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				description: event.currentTarget.value
			})} />
		<TextInput
			id='definition'
			value={selectedComponent.definition}
			labelText='Tooltip Message'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				definition: event.currentTarget.value
			})} />
		<Checkbox
			id='defaultOpen'
			labelText='Default open'
			checked={selectedComponent.isDefaultOpened}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isDefaultOpened: checked
		})} />
		<Checkbox
			id='openOnHover'
			labelText='Open on hover'
			checked={selectedComponent.isOpenOnHover}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isOpenOnHover: checked
		})} />
	</>;
};

export const ADefinitionTooltipCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ADefinitionTooltip = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}

		{...rest}>
			<div className={`${preventCheckEvent} ${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} `}>
				<DefinitionTooltip
					className={css`${styleObjectToString(componentObj.style)}`}
					definition={componentObj.definition}
					align={componentObj.alignment}>
						{componentObj.description}
				</DefinitionTooltip>
			</div>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ADefinitionTooltip,
	settingsUI: ADefinitionTooltipSettingsUI,
	codeUI: ADefinitionTooltipCodeUI,
	render: ({ componentObj, select, remove, selected }) => <ADefinitionTooltip
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected} />,
	keywords: ['definition tooltip', 'definition', 'tooltip'],
	name: 'Definition tooltip',
	type: 'definition-tooltip',
	defaultComponentObj: {
		type: 'definition-tooltip',
		description: 'description'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Description = "${json.description ? json.description : 'description'}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}IsOpen = ${json.isDefaultOpened ? json.isDefaultOpened : false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Align: any = "${json.alignment ? json.alignment : 'bottom-start' }";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}definition = "${json.definition ?
					json.definition : 'default tooltip message' }";`,
				outputs: ({ json }) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					return `@Output() ${name}isOpenChange = new EventEmitter<any>();
					@Output() ${name}onClose = new EventEmitter<any>();
					@Output() ${name}onOpen = new EventEmitter<any>();`;
				},
				imports: ['TooltipModule'],
				code: ({ json }) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					return `<cds-tooltip-definition
						[isOpen]="${name}IsOpen"
						[align]="${name}Align"
						(onOpen)="${name}onOpen.emit($event)"
						(onClose)="${name}onClose.emit($event)"
						(isOpenChange)="${name}isOpenChange.emit($event)"
						[description]="${name}definition">
						{{${name}Description}}
					</cds-tooltip-definition>`;
				}
			},
			v10: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Description = "${json.description ? json.description : 'description'}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}IsOpen = ${json.isDefaultOpened ? json.isDefaultOpened : false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Align: any = "${json.alignment ? json.alignment : 'bottom-left' }";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}definition = "${json.definition ?
					json.definition : 'default tooltip message' }";`,
				outputs: ({ json }) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					return `@Output() ${name}isOpenChange = new EventEmitter<any>();
					@Output() ${name}onClose = new EventEmitter<any>();
					@Output() ${name}onOpen = new EventEmitter<any>();`;
				},
				imports: ['TooltipModule'],
				code: ({ json }) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					return `<ibm-tooltip-definition
						[isOpen]="${name}IsOpen"
						[align]="${name}Align"
						(onOpen)="${name}onOpen.emit($event)"
						(onClose)="${name}onClose.emit($event)"
						(isOpenChange)="${name}isOpenChange.emit($event)"
						[description]="${name}definition">
						{{${name}Description}}
					</ibm-tooltip-definition>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['DefinitionTooltip'],
				code: ({ json }) => `<DefinitionTooltip
					${reactClassNamesFromComponentObj(json)}
					align="${json.alignment}"
					${json.isDefaultOpened ? `defaultOpen={${json.isDefaultOpened}}` : ''}
					definition="${json.definition ? json.definition : 'default tooltip message'}"
					${json.isOpenOnHover ? `openOnHover={${json.isOpenOnHover}}` : ''}>
						${json.description ? json.description : 'description'}
				</DefinitionTooltip>`
			},
			v10: {
				imports: ['DefinitionTooltip'],
				code: ({ json }) => `<DefinitionTooltip
					${reactClassNamesFromComponentObj(json)}
					align="${json.alignment}"
					${json.isDefaultOpened ? `defaultOpen={${json.isDefaultOpened}}` : ''}
					definition="${json.definition ? json.definition : 'default tooltip message'}"
					${json.isOpenOnHover ? `openOnHover={${json.isOpenOnHover}}` : ''}>
						${json.description ? json.description : 'description'}
				</DefinitionTooltip>`
			}
		}
	}
};
