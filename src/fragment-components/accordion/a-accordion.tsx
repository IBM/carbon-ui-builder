import React from 'react';
import { Accordion, Dropdown } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';

import image from '../../assets/component-icons/accordion.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const AAccordionSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	const alignItems = [
		{ id: 'end', text: 'End' },
		{ id: 'start', text: 'Start' }
	];

	return <>
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
		})}/>
		<Dropdown
			label='Alignment of accordion heading'
			titleText='Alignment'
			items={alignItems}
			selectedItem={alignItems.find(item => item.id === selectedComponent.align)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				align: event.selectedItem.id
		})}/>
	</>;
};

export const AAccordion = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<Accordion
			align={componentObj.align}
			size={componentObj.size}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{children}
			</Accordion>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AAccordion,
	settingsUI: AAccordionSettingsUI,
	render: ({ componentObj, select, remove, selected, renderComponents, outline }) => <AAccordion
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.items.map((accordionItem: any) => renderComponents(accordionItem, outline))}
	</AAccordion>,
	keywords: ['accordion'],
	name: 'Accordion',
	type: 'accordion',
	defaultComponentObj: {
		type: 'accordion',
		align: 'end',
		size: 'md',
		items: [
			{
				type: 'accordion-item',
				title: 'Accordion item',
				items: []
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Align = "${json.align}";`,
			outputs: () => '',
			imports: ['AccordionModule'],
			// NOTE: Angular accordion does not support size yet.
			// Issue being tracked here: https://github.com/IBM/carbon-components-angular/issues/2022
			// NOTE: Angular accordion align end does not behave as expected.
			// Issue being tracked here: https://github.com/IBM/carbon-components-angular/issues/2023
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ibm-accordion
					[align]="${nameStringToVariableString(json.codeContext?.name)}Align"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ibm-accordion>`;
			}
		},
		react: {
			imports: ['Accordion'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<Accordion
					${json.align !== undefined ? `align='${json.align}'` : ''}
					${json.size !== undefined ? `size='${json.size}'` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</Accordion>`;
			}
		}
	}
};
