import React from 'react';
import {
	OverflowMenu
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/overflowMenu.svg';
import { css } from 'emotion';
import { reactClassNamesFromComponentObj, angularClassNamesFromComponentObj } from '../utils/fragment-tools';
import { ComponentCssClassSelector } from '../components/css-class-selector';

export const AOverflowMenuStyleUI = ({ selectedComponent, setComponent }: any) => {
	return(<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent}/>);
};

export const AOverflowMenuGroup = ({
	children,
	componentObj,
	onDrop,
	...rest
}: any) => {
	const selectedItem = children.find((item: any) => item.props.selected === true)?.props.componentObj?.className;
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		{...rest}>
			<OverflowMenu
					onDrop={onDrop}
					selectorPrimaryFocus={'.' + (selectedItem ? selectedItem : 'option-1')}
					className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
						{children}
			</OverflowMenu>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AOverflowMenuGroup,
	styleUI: AOverflowMenuStyleUI,
	keywords: ['overflow', 'menu', 'context'],
	name: 'Overflow menu',
	type: 'overflow-menu',
	defaultComponentObj: {
		isDelete: false,
		type: 'overflow-menu',
		items: [
			{
				type: 'overflow-menu-item',
				itemText: 'Option 1',
				className: 'option-1',
				disabled: false,
				hasLink: false,
				isDelete: false,
				hasDivider: false,
				link: ''
			},
			{
				type: 'overflow-menu-item',
				itemText: 'Option 2',
				className: 'option-2',
				disabled: false,
				hasLink: false,
				isDelete: false,
				hasDivider: false,
				link: ''
			},
			{
				type: 'overflow-menu-item',
				itemText: 'Option 3',
				className: 'option-3',
				disabled: false,
				hasLink: false,
				isDelete: false,
				hasDivider: false,
				link: ''
			}
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <AOverflowMenuGroup
		componentObj={componentObj}
		select={select}
		remove={remove}
		onDragOver={onDragOver}
		onDrop={onDrop}
		selected={selected}>
			{componentObj.items.map((button: any) => (renderComponents(button)))}
	</AOverflowMenuGroup>,
	image: image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['DialogModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ibm-overflow-menu
							${angularClassNamesFromComponentObj(json)}>
								${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
						</ibm-overflow-menu>`;
			}
		},
		react: {
			imports: ['OverflowMenu'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<OverflowMenu
							${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
						</OverflowMenu>`;
			}
		}
	}
};
