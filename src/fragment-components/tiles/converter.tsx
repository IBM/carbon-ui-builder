import React from 'react';
import {
	Dropdown
} from 'carbon-components-react';

import { getParentComponent, updatedState } from '../../components';
import { useFragment } from '../../context';

export const TileMorphism = ({ component, componentSetter }: any) => {

	const items = [
		{
			id: 'tile',
			text: 'Tile',
			defaultComponent: {
				type: 'tile',
			}
		},
		{
			id: 'clickabletile',
			text: 'Clickable tile',
			defaultComponent: {
				type: 'clickabletile',
			}
		},
		{
			id: 'expandabletile',
			text: 'Expandable tile',
			defaultComponent: {
				type: 'expandabletile',
				expanded: true,
				outline: true,
				items: [
					{
						type: 'tilefold', aboveFold: true,
						items: []
					},
					{
						type: 'tilefold', aboveFold: false,
						items: []
					}
				]
			}
		},
		{
			id: 'selectabletile',
			text: 'Standalone selectable tile',
			defaultComponent: {
				type: 'selectabletile',
				standalone: true,
				value: 'value',
				title: 'title',
				disabled: false,
				selected: false,
			}
		},
		{
			id: 'selectableTileGroup',
			text: 'Multiselect tiles',
			defaultComponent: {
				type: 'selectableTileGroup',
				tileGroup: true,
			},
			childDefaultComponent: {
				type: 'selectabletile',
				value: 'Value',
				formItemName: 'tile-group',
				selected: false,
				standalone: false,
			}
		},
		{
			id: 'radioTileGroup',
			text: 'Radio tiles',
			defaultComponent: {
				type: 'radioTileGroup',
				formItemName: 'tile-group',
				legend: 'Radio Tile Group',
				tileGroup: true,
			},
			childDefaultComponent: {
				type: 'radiotile',
				value: 'Value',
				formItemName: 'tile-group',
			}
		}
	];

	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, component);

	// Filter out `current` component type from displaying
	let type = component.type;
	if (parentComponent?.tileGroup) {
		type = parentComponent.type;
	}

	// Conversion to different types
	const convert = ({ selectedItem }: any) => {

		if (parentComponent.tileGroup && selectedItem.defaultComponent?.tileGroup) {
			/**
			 * Group to Group
			 * Update parent & children to the other group type
			 * Morphs all children to the selected tile type
			 */
			Object.assign(parentComponent, selectedItem.defaultComponent);
			parentComponent?.items.forEach((tile: any) => {
				Object.assign(tile, selectedItem.childDefaultComponent);
			});
		} else if (parentComponent?.tileGroup && !selectedItem.defaultComponent?.tileGroup) {
			/**
			 * Group to Single
			 * Get child items from all grouped tiles & assign it to the new standalone tile
			 */
			const children: any[] = [];
			parentComponent?.items.forEach((tile: any) => {
				// Tile wrappers can only hold tiles
				children.push(...tile.items);
			});

			Object.assign(parentComponent, selectedItem.defaultComponent);

			// Expandable tile has 2 fold children which we want to show
			if (selectedItem.id !== 'expandabletile') {
				parentComponent.items = children;
			} else {
				parentComponent.items[0].items = children;
			}

			// Deleting key, can also set it to false
			delete parentComponent.tileGroup;

		} else if (!component.tileGroup && selectedItem.defaultComponent?.tileGroup) {

			/**
			 * Single to Group
			 * Set current component as a wrapper & add 3 tile children with the `current` items passed
			 * in first child.
			 */
			let compItems = component.items;

			// Expandable tile has 2 fold children which we must get items from
			if (type === 'expandabletile') {
				compItems = [];
				component.items.forEach((fold: any) => {
					compItems.push(...fold.items);
				});
			}

			componentSetter({
				...component,
				...selectedItem.defaultComponent,
				items: [
					{ ...selectedItem.childDefaultComponent, items: compItems },
					{ ...selectedItem.childDefaultComponent, items: [] },
					{ ...selectedItem.childDefaultComponent, items: [] }
				],
				tileGroup: true
			});
		} else {
			/**
			 * Single to single
			 * Majority of the attributes are the same, so they will be overwritten to default state
			 */
			let children = component.items;
			Object.assign(component, selectedItem.defaultComponent);

			// Special case - Expandable tile has 2 fold children which we must get items from
			if (type === 'expandabletile') {
				children = [];
				component.items.forEach((fold: any) => {
					children.push(...fold.items);
				});
				component.items = children;
			} else if (selectedItem.id === 'expandabletile') {
				component.items[0].items = children;
			}
		}

		// Trigger rerender
		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				{
					type: 'update',
					component: {}
				}
			)
		})
	}

	return <>
		<Dropdown
			id="tile-morpher"
			label="Convert to another tile type"
			titleText="Tile type"
			items={items.filter(({ id }) => id !== type)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={convert}
		/>
	</>
}
