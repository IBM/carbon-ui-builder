import React from 'react';
import { Dropdown } from 'carbon-components-react';
import { getParentComponent, updatedState } from '../../components';
import { useFragment } from '../../context';

// Combine all items from 'top' & 'bottom' folds into a single array
const getExpandableTileItems = (expandableTile: any) => {
	const items: any = [];
	expandableTile.items.forEach((item: any) => {
		if (item.type === 'tile-fold') {
			items.push(...item.items);
		} else {
			items.push({ ...item });
		}
	});

	return items;
};

/**
 *  Morph parent (Group) & children to other group type
 */
const groupToGroup = (selectedItem: any, component: any) => {
	return {
		...component,
		...selectedItem.defaultComponent,
		items: component.items.map((tile: any) => ({
			...tile,
			...selectedItem.childDefaultComponent
		}))
	};
};

/**
 * Takes the children tiles of the group, converts them & places them in current components position
 */
const groupToSingle = (selectedItem: any, component: any, parentComponent: any) => {
	const tiles = component.items.map((tile: any) => {
		const tileItems = [...tile.items];

		// Adds empty bottom fold
		if (selectedItem.id === 'expandabletile') {
			tileItems.push(...selectedItem.defaultComponent.items);
		}

		return {
			...tile,
			...selectedItem.defaultComponent,
			items: tileItems
		};
	});

	// We are not destructuring entire component object since we do not want tile `group` specific attributes
	const componentIndex = parentComponent.items.indexOf(component);
	const items = [
		...parentComponent.items.slice(0, componentIndex),
		...tiles,
		...parentComponent.items.slice(componentIndex + 1)
	];

	return {
		...parentComponent,
		items
	};
};

/**
 * Sets current component as a wrapper & passes a single tile as an item (child)
 */
const singleToGroup = (selectedItem: any, component: any) => {
	return {
		...component,
		...selectedItem.defaultComponent,
		items: [
			{
				...selectedItem.childDefaultComponent,
				codeContext: {
					formItemName: component.codeContext?.name
				},
				items: (component.type === 'expandable-tile') ? getExpandableTileItems(component) : [...component.items]
			}
		],
		tileGroup: true
	};
};

/**
 * Majority of the atrributes are the same, so they will be overwrriten to default state
 */
const singleToSingle = (selectedItem: any, component: any) => {
	const items = [];

	if (component.type === 'expandable-tile') {
		items.push(...getExpandableTileItems(component));
	} else if (selectedItem.id === 'expandabletile') {
		items.push(...component.items, ...selectedItem.defaultComponent.items);
	} else {
		items.push(...component.items);
	}

	return {
		...component,
		...selectedItem.defaultComponent,
		items
	};
};

/**
 * Dropdown component to morph between different tiles
 */
export const TileMorphism = ({ component, setComponent }: any) => {
	const tileTypes = [
		{
			id: 'tile',
			text: 'Tile',
			defaultComponent: {
				type: 'tile'
			}
		},
		{
			id: 'clickabletile',
			text: 'Clickable tile',
			defaultComponent: {
				type: 'clickable-tile'
			}
		},
		{
			id: 'expandabletile',
			text: 'Expandable tile',
			defaultComponent: {
				type: 'expandable-tile',
				expanded: true,
				outline: false,
				items: [
					{
						type: 'tile-fold',
						items: []
					}
				]
			}
		},
		{
			id: 'selectabletile',
			text: 'Standalone selectable tile',
			defaultComponent: {
				type: 'selectable-tile',
				standalone: true,
				disabled: false,
				selected: false
			}
		},
		{
			id: 'selectableTileGroup',
			text: 'Multiselect tiles',
			defaultComponent: {
				type: 'selectable-tile-group',
				tileGroup: true
			},
			childDefaultComponent: {
				type: 'selectable-tile',
				selected: false,
				standalone: false
			}
		},
		{
			id: 'radioTileGroup',
			text: 'Radio tiles',
			defaultComponent: {
				type: 'radio-tile-group',
				legend: 'Radio Tile Group',
				tileGroup: true
			},
			childDefaultComponent: {
				type: 'radio-tile'
			}
		}
	];

	const [fragment, setFragment] = useFragment();

	const convert = ({ selectedItem }: any) => {
		// Conversion to different types
		if (component?.tileGroup && selectedItem.defaultComponent?.tileGroup) {
			setComponent(
				groupToGroup(selectedItem, component)
			);
		} else if (component?.tileGroup && !selectedItem.defaultComponent?.tileGroup) {
			const parentComponent: any = getParentComponent(fragment.data, component);

			setFragment({
				...fragment,
				data: updatedState(fragment.data, {
					type: 'update',
					component: groupToSingle(selectedItem, component, parentComponent)
				})
			});
		} else if (!component.tileGroup && selectedItem.defaultComponent?.tileGroup) {
			setComponent(
				singleToGroup(selectedItem, component)
			);
		} else {
			setComponent(
				singleToSingle(selectedItem, component)
			);
		}
	};

	return <Dropdown
		id="tile-morpher"
		label="Convert to another tile type"
		titleText="Tile type"
		selectedItem={tileTypes.find(item => item.id === component.type)}
		items={tileTypes}
		itemToString={(item: any) => (item ? item.text : '')}
		onChange={convert}
	/>;
};
