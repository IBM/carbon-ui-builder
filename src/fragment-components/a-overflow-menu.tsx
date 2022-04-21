/* eslint-disable react/jsx-indent-props */
import React from 'react';
import {
	Dropdown,
	Checkbox,
	OverflowMenu
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import image from './../assets/component-icons/overflowMenu.svg';
import { css } from 'emotion';

export const AOverflowMenuStyleUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];
	return <>
		<Dropdown
			label='Size'
			id='size'
			titleText='Size'
			items={sizeItems}
			initialSelectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				disabled: selectedComponent.items.forEach((item: any) => item.disabled = checked)
		})} />
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>;
};

export const AOverflowMenuGroup = ({
	children,
	componentObj,
	...rest
}: any) => {
	const selectedItem = children.find((item: any) => item.props.selected === true)?.props.componentObj?.className;
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
			<OverflowMenu
				selectorPrimaryFocus={'.' + (selectedItem ? selectedItem : 'option-1')}
                className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
				disabled= {componentObj.disabled}
				size= {componentObj.size}>
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
		disabled: false,
		isDelete: false,
		size: 'md',
		type: 'overflow-menu',
		items: [
			{
				type: 'overflow-menu-item',
				itemText: 'Option 1',
				className: 'option-1',
				disabled: false,
				hasLink: false,
				isDelete: false,
				link: ''
			},
			{
				type: 'overflow-menu-item',
				itemText: 'Option 2',
				className: 'option-2',
				disabled: false,
				hasLink: false,
				isDelete: false,
				link: ''
			},
			{
				type: 'overflow-menu-item',
				itemText: 'Option 3',
				className: 'option-3',
				disabled: false,
				hasLink: false,
				isDelete: false,
				link: ''
			}
		]
	},
	render: ({ componentObj, select, remove, selected, renderComponents }) => <AOverflowMenuGroup
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.items.map((button: any) => (renderComponents(button)))}
	</AOverflowMenuGroup>,
	image: image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: [''],
			code: (_) => {
				return '';
			}
		},
		react: {
			imports: [''],
			code: () => {
				return '';
			}
		}
	}
};
