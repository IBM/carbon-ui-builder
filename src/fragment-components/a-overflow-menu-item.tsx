/* eslint-disable react/jsx-indent-props */
import React from 'react';
import {
	OverflowMenuItem,
	Checkbox
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { useFragment } from '../context';
import {
	getParentComponent,
	updatedState,
	Adder
} from '../components';
import image from './../assets/component-icons/link.svg';
import { css } from 'emotion';

export const AOverflowMenuItemStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				disabled: checked
		})} />
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent}/>
	</>;
};

export const AOverflowMenuItem = ({
	componentObj,
	selected,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addItem = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'overflowMenuItem',
					value: `${componentObj.id}`,
					itemText: 'New Option',
					disabled: false
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});
	return (
		<Adder
		active={selected}
		key={componentObj.id}
		topAction={() => addItem(1)}>
			<AComponent
			selected={selected}
			className={css`width: 100%;`}
			componentObj={componentObj}
			{...rest}>
				<OverflowMenuItem
					itemText={componentObj.itemText}
					disabled= {componentObj.disabled}
					/>
			</AComponent>
		</Adder>
	);
};

export const componentInfo: ComponentInfo = {
	component: AOverflowMenuItem,
	styleUI: AOverflowMenuItemStyleUI,
	render: ({ componentObj, select, remove, selected }) => <AOverflowMenuItem
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.itemText}
	</AOverflowMenuItem>,
	keywords: ['overflow', 'item'],
	name: 'Overflow menu item',
	defaultComponentObj: {
		type: 'overflowMenuItem'
	},
	image: image,
	hideFromElementsPane: true,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: [],
			code: () => {
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
