/* eslint-disable react/jsx-indent-props */
import React from 'react';
import {
	Dropdown,
	Checkbox,
	OverflowMenu
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import image from './../assets/component-icons/link.svg';

export const AOverflowMenuStyleUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];
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

// export const AOverflowMenuCodeUI = ({ selectedComponent, setComponent }: any) => {
// const allItems = selectedComponent.items.map((item: any) => {
// 	return {
// 		text: item.labelText,
// 		id: item.id,
// 		defaultChecked: item.defaultChecked
// 	};
// });
// selectedComponent.defaultSelected = `${selectedComponent.items.find(((item: any) => {
// 	return item.defaultChecked;
// }))?.id}`;
// };

export const AOverflowMenuGroup = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<OverflowMenu
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
	keywords: ['overflow', 'menu'],
	name: 'Overflow menu',
	defaultComponentObj: {
		disabled: false,
		isDelete: false,
		size: 'md',
		type: 'overflowMenu',
		items: [
			{
				type: 'overflowMenuItem',
				itemText: 'Option 1',
				id: 'option-1',
				disabled: false
			},
			{
				type: 'overflowMenuItem',
				itemText: 'Option 2',
				id: 'option-2',
				disabled: false
			},
			{
				type: 'overflowMenuItem',
				itemText: 'Option 3',
				id: 'option-3',
				disabled: false
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
	image,
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
