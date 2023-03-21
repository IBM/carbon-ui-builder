import React from 'react';
import {
	AccordionItem,
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import { css, cx } from 'emotion';
import image from '../../assets/component-icons/accordion-item.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';
import { useFragment } from '../../context';
import {
	getParentComponent,
	updatedState
} from '../../components';
import { APlaceholder } from '../a-placeholder';
import { styleObjectToString } from '../../ui-fragment/src/utils';
import { Adder } from '../../sdk/src/adder';

export const AAccordionItemSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			id='accordion-item-title-text-input'
			value={selectedComponent.title}
			labelText='Title'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					title: event.currentTarget.value
				});
			}} />
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}} />
	</>;
};

export const AAccordionItemCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	id='accordion-item-input-name-text-input'
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

export const AAccordionItem = ({
	children,
	componentObj,
	selected,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addAccordionItem = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'accordion-item',
					title: 'New accordion item',
					items: []
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	return (
		<Adder
		active={selected}
		topAction={() => addAccordionItem()}
		bottomAction={() => addAccordionItem(1)}>
			<AComponent
			{...rest}
			componentObj={componentObj}
			selected={selected}>
				<AccordionItem
				title={componentObj.title}
				disabled={componentObj.disabled}
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`
				)}>
					{
						children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
					}
				</AccordionItem>
			</AComponent>
		</Adder>
	);
};

export const componentInfo: ComponentInfo = {
	component: AAccordionItem,
	hideFromElementsPane: true,
	settingsUI: AAccordionItemSettingsUI,
	codeUI: AAccordionItemCodeUI,
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline }) => <AAccordionItem
		key={componentObj.id}
		componentObj={componentObj}
		select={select}
		remove={remove}
		onDragOver={onDragOver}
		onDrop={onDrop}
		selected={selected}>
			{componentObj.items.map((child: any) => renderComponents(child, outline))}
	</AAccordionItem>,
	keywords: ['accordion', 'item'],
	name: 'Accordion item',
	type: 'accordion-item',
	defaultComponentObj: {
		type: 'accordionitem',
		title: 'Accordion item',
		disabled: false,
		items: []
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Title = "${json.title}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${!!json.disabled}`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter();`,
			imports: ['AccordionModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ibm-accordion-item
					[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
					[title]="${nameStringToVariableString(json.codeContext?.name)}Title"
					(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ibm-accordion-item>`;
			}
		},
		react: {
			imports: ['AccordionItem'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<AccordionItem
					title="${json.title || ''}"
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</AccordionItem>`;
			}
		}
	}
};
