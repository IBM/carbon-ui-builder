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
		<Checkbox
			labelText='Is delete'
			id='isDelete'
			checked={selectedComponent.isDelete}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				isDelete: checked
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
				hasLink: checked,
				link: checked ? selectedComponent.link : ''
		})} />
		<TextInput
			value={selectedComponent.link}
			disabled= {!selectedComponent.hasLink}
			labelText='Link'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
						link: event.currentTarget.value
				});
			}}
		/>
	</>;
};

const addButtonStyle = css`
	position: relative;
`;
const headingStyle = css`
	width: 12rem;
`;

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
					itemText: 'New Option',
					className: componentObj.id,
					disabled: false,
					hasLink: false,
					isDelete: false,
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
		addButtonsCss={addButtonStyle}
		leftAction= {() => addItem(0)}
		bottomAction={() => addItem(1)}>
			<AComponent
			headingCss={headingStyle}
			selected={selected}
			className={css`width: 100%;`}
			componentObj={componentObj}
			{...rest}>
				<OverflowMenuItem
					isDelete={componentObj.isDelete}
					className={componentObj.id}
					href={componentObj.hasLink ? '#' : undefined}
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
