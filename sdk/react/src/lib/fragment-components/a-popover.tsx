import React from 'react';
import {
	Popover,
	PopoverContent,
	Dropdown,
	TextInput,
	Checkbox
} from '@carbon/react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/popover.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';

export const APopoverSettingsUI = ({ selectedComponent, setComponent }: any) => {

	const alignItems = [
		{ id: 'top', text: 'Top' },
		{ id: 'top-start', text: 'Top start' },
		{ id: 'top-end', text: 'Top end' },
		{ id: 'top-left', text: 'Top left' },
		{ id: 'top-right', text: 'Top right' },
		{ id: 'bottom', text: 'Bottom' },
		{ id: 'bottom-left', text: 'Bottom left' },
		{ id: 'bottom-right', text: 'Bottom right' },
		{ id: 'bottom-start', text: 'Bottom start' },
		{ id: 'bottom-end', text: 'Bottom end' },
		{ id: 'left', text: 'Left' },
		{ id: 'left-bottom', text: 'Left bottom' },
		{ id: 'left-top', text: 'Left top' },
		{ id: 'left-end', text: 'Left end' },
		{ id: 'left-start', text: 'Left start' },
		{ id: 'right', text: 'Right' },
		{ id: 'right-top', text: 'Right top' },
		{ id: 'right-bottom', text: 'Right bottom' },
		{ id: 'right-end', text: 'Right end' },
		{ id: 'right-start', text: 'Right start' }
	];

	return <>
		<Checkbox
			labelText='Open'
			id='is-open'
			checked={selectedComponent.isOpen}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isOpen: checked
		})} />

        <Checkbox
        labelText='Tab tip'
        id='is-tab-tip'
        checked={selectedComponent.isTabTip}
        onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isTabTip: checked
		})} />

        <Checkbox
        labelText='Caret'
        id='caret'
        checked={selectedComponent.isShowCaret}
        onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isShowCaret: checked
		})} />

        <Checkbox
        labelText='Drop shadow'
        id='drop-shadow'
        checked={selectedComponent.isDropShadow}
        onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isDropShadow: checked
		})} />

        <Checkbox
        labelText='High contrast'
        id='high-contrast'
        checked={selectedComponent.isHighContrast}
        onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isHighContrast: checked
		})} />

        <Dropdown
        id='align'
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
        value={selectedComponent.text}
        labelText='Popover text'
        onChange={(event: any) => setComponent({
				...selectedComponent,
				text: event.currentTarget.value
			})} />

		<TextInput
			id='Popover-label'
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				label: event.currentTarget.value
			})} />
	</>;
};

export const APopoverCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const APopover = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
            <Popover
            align={componentObj.align}
            caret={componentObj.isShowCaret}
            dropShadow={componentObj.isDropShadow}
            highContrast={componentObj.isHighContrast}
            open={componentObj.isOpen}
            className={cx(
                    componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
                    css`${styleObjectToString(componentObj.style)}`
                )}>
					{componentObj.label}
                    <PopoverContent>
                        {componentObj.text}
                        {children}
                    </PopoverContent>
                </Popover>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: APopover,
	settingsUI: APopoverSettingsUI,
	codeUI: APopoverCodeUI,
	render: ({ componentObj, select, remove, selected }) => <APopover
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.text}
	</APopover>,
	keywords: ['popover'],
	name: 'Popover',
	type: 'popover',
	defaultComponentObj: {
		type: 'popover',
		label: 'popover',
		isOpen: true
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `
                    @Input() ${nameStringToVariableString(json.codeContext?.name)}IsOpen = ${json.isOpen};
                    @Input() ${nameStringToVariableString(json.codeContext?.name)}IsShowCaret = ${json.isShowCaret};
                    @Input() ${nameStringToVariableString(json.codeContext?.name)}IsDropShadow = ${json.isDropShadow};
                    @Input() ${nameStringToVariableString(json.codeContext?.name)}IsHighContrast = ${json.isHighContrast};
                    @Input() ${nameStringToVariableString(json.codeContext?.name)}Align: any = '${json.align ? json.align : 'bottom'}';
                    @Input() ${nameStringToVariableString(json.codeContext?.name)}Text = '${json.text}';
                `,
				outputs: ({ json }) => `
                    @Output() ${nameStringToVariableString(json.codeContext?.name)}OnOpen = new EventEmitter();
                    @Output() ${nameStringToVariableString(json.codeContext?.name)}OnClose = new EventEmitter();
                    @Output() ${nameStringToVariableString(json.codeContext?.name)}IsOpenChange = new EventEmitter();`,
				imports: ['PopoverModule'],
				code: ({ json }) => {
					return `<div
                        cdsPopover
                        ${angularClassNamesFromComponentObj(json)}
                        [isOpen]="${nameStringToVariableString(json.codeContext?.name)}IsOpen"
                        [dropShadow]="${nameStringToVariableString(json.codeContext?.name)}IsDropShadow"
                        [align]="${nameStringToVariableString(json.codeContext?.name)}Align"
                        [caret]="${nameStringToVariableString(json.codeContext?.name)}IsShowCaret"
                        [highContrast]="${nameStringToVariableString(json.codeContext?.name)}IsHighContrast"
                        (onOpen)="${nameStringToVariableString(json.codeContext?.name)}OnOpen.emit($event)"
                        (onClose)="${nameStringToVariableString(json.codeContext?.name)}onClose.emit($event)"
                        (isOpenChange)="${nameStringToVariableString(json.codeContext?.name)}IsOpenChange.emit($event)">
                            <div class="popover-trigger">
                                <svg
									preserveAspectRatio="xMidYMid meet"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 32 32">
                                    <path d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM6,26V6H26V26Z"></path>
                                </svg>
                            </div>
                            <cds-popover-content>
                                <div style="padding: 1rem">
                                    ${ json.text }
                                </div>
                            </cds-popover-content>
                        </div>
                    `;
				}
			},
			v10: {
				inputs: () => '',
				outputs: () => '',
				imports: [],
				code: () => ''
			}
		},
		react: {
			latest: {
				imports: ['Popover', 'PopoverContent'],
				code: ({ json }) => {
					return `<Popover
                        open={${json.isOpen ? json.isOpen : false}}
                        align={"${json.align ? json.align : (json.isTabTip ? 'bottom-start' : 'bottom')}"}
                        caret={${json.isShowCaret ? json.isShowCaret : (json.isTabTip ? false : true)}}
                        dropShadow={${json.isDropShadow ? json.isDropShadow : true}}
                        highContrast={${json.isHighContrast ? json.isHighContrast : true}}
                        ${json.isTabTip ? 'isTabTip' : ''}
                        ${reactClassNamesFromComponentObj(json)}>
                            <PopoverContent>
                                ${ json.text }
                            </PopoverContent>
                        </Popover>`;
				}
			},
			v10: {
				imports: [],
				code: () => ''
			}
		}
	}
};
