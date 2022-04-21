/* eslint-disable react/jsx-indent-props */
import React from 'react';
import {
	OverflowMenuItem,
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { useFragment } from '../context';
import {
	getParentComponent,
	updatedState,
	Adder
} from '../components';

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

export const AOverflowMenuItemCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Has link'
			id='hasLink'
			checked={selectedComponent.hasLink}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				hasLink: checked
		})} />
		<TextInput
			value={selectedComponent.codeContext?.name}
			disabled= {!selectedComponent.hasLink}
			labelText='Link'
			onChange={(event: any) => {
				setComponent({
					codeContext: {
						...selectedComponent.codeContext,
						link: event.currentTarget.value
					}
				});
			}}
		/>
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
					type: 'overflow-menu-item',
					value: `${componentObj.id}`,
					itemText: 'New Option',
					disabled: false,
					hasLink: false,
					link: ''
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
					href={componentObj.isLink ? componentObj.codeContext?.link : undefined}
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
	codeUI: AOverflowMenuItemCodeUI,
	render: ({ componentObj, select, remove, selected }) => <AOverflowMenuItem
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.itemText}
	</AOverflowMenuItem>,
	keywords: ['overflow', 'item'],
	name: 'Overflow menu item',
	type: 'overflow-menu-item',
	defaultComponentObj: {
		type: 'overflow-menu-item'
	},
	image: undefined,
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
