import React from 'react';
import * as Icons from '@carbon/icons-react';

export interface IconState {
	type: string;
	label: string;
	size: string;
	key: string;
	name: string;
	selectedSize: string;
	selectedIcon: any;
	items: any[];

}
const sizeItems = [
	{ id: '16', text: 'Small' },
	{ id: '20', text: 'Medium' },
	{ id: '24', text: 'Large' },
	{ id: '32', text: 'Extra large' }
];

const getIcons = () => {
	const allIcons: any = [];
	Object.entries(Icons).forEach(([iconValue, iconObj]: any[]) => {
		const icon = iconValue.split(/(\d+)/);
		const [iconName, sizeValue] = [icon[0], icon[1]];
		const iconItem = {
			key: iconName,
			componentObj: {
				keywords: [iconValue, iconValue.toLowerCase(), iconValue.replace(/[0-9]/g, '')],
				// size list for each selected icon is used in the Sizes dropdown
				size: [{ size: sizeValue, text: sizeItems.find((sizeItem: any) => sizeItem.id === sizeValue)?.text, component: iconObj }],
				key: iconName,
				label: String(iconName),
				name: iconObj.render.name,
				type: 'icon',
				selectedIcon: iconObj,
				selectedSize: sizeValue
			}
		};
		if (iconValue !== 'Icon') {
			const isIncluded = allIcons.some((item: any) => item.key === iconItem.key);
			if (isIncluded) {
				const current = allIcons.find((item: any) => item.key === iconItem.key);
				current.componentObj.size.push({ size: sizeValue,
					text: sizeItems.find((sizeItem: any) => sizeItem.id === sizeValue)?.text, component: iconObj });
			} else {
				// push the icons into a list which is displayed in the modal
				allIcons.push(iconItem);
			}
		}
	});
	return allIcons;
};

export const UIIcon = ({ state }: {
	state: IconState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'icon') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	state.items = getIcons();
	const component = state.key === ''
		? state.items.find((item: any) => item.key === 'Add').componentObj
		: state.items.find((item: any) => item.key === state.key).componentObj;
	if (!state.size) {
		state.selectedIcon = component.selectedIcon;
		state.key = component.key;
		state.size = component.size;
		state.name = component.name;
		state.selectedSize = component.selectedSize;
	} else {
		state.selectedIcon = component.size.find((sizeItem: any) => sizeItem.size === state.selectedSize).component;
	}

	return <state.selectedIcon />;
};
