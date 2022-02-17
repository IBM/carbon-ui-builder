import React from 'react';
import { Accordion, Dropdown } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import { ComponentCssClassSelector } from '../../components/css-class-selector';

import image from '../../assets/component-icons/accordion.svg';
import { angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../../utils/fragment-tools';

export const AAccordionStyleUI = ({selectedComponent, setComponent}: any) => {
	const sizeItems = [
		{id: 'sm', text: 'Small'},
		{id: 'md', text: 'Medium'},
		{id: 'lg', text: 'Large'}
	];

	const alignItems = [
		{id: 'end', text: 'End'},
		{id: 'start', text: 'Start'}
	]

	return <>
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			initialSelectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
		})}/>
		<Dropdown
			label='Alignment of accordion heading'
			titleText='Alignment'
			items={alignItems}
			initialSelectedItem={alignItems.find(item => item.id === selectedComponent.align)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				align: event.selectedItem.id
		})}/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
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
	styleUI: AAccordionStyleUI,
	render: ({ componentObj, select, remove, selected, renderComponents }) => <AAccordion
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
		{componentObj.items.map((accordionItem: any) => (
			renderComponents(accordionItem)
		))}
	</AAccordion>,
	keywords: ['accordion'],
	name: 'Accordion',
	defaultComponentObj: {
		type: 'accordion',
		align: 'end',
		size: 'md',
		items: [
			{
				type: 'accordionitem',
				title: 'Accordion item 1',
				items: [{ type: 'text', text: 'Accordion item 1 content' }]
			},
			{
				type: 'accordionitem',
				title: 'Accordion item 2',
				items: [{ type: 'text', text: 'Accordion item 2 content' }]
			},
			{
				type: 'accordionitem',
				title: 'Accordion item 3',
				items: [{ type: 'text', text: 'Accordion item 3 content' }]
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({json}) => ``,
			outputs: ({json}) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
			imports: ['AccordionModule'],
			// NOTE: Angular accordion does not support size yet.
			// Issue being tracked here: https://github.com/IBM/carbon-components-angular/issues/2022
			// NOTE: Angular accordion align end does not behave as expected.
			// Issue being tracked here: https://github.com/IBM/carbon-components-angular/issues/2023
			code: ({ json, jsonToTemplate }) => {
				return `<ibm-accordion
					${json.align !== undefined ? `align="${json.align}"` : ''}
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ibm-accordion>`;
			}
		},
		react: {
			imports: ['Accordion'],
			code: ({ json, jsonToTemplate }) => {
				return `<Accordion
					${json.align !== undefined ? `align='${json.align}'` : ''}
					${json.size !== undefined ? `size='${json.size}'` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</Accordion>`;
			}
		}
	}
};
