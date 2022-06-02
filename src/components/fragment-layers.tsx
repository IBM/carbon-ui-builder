import React from 'react';
import { HierarchyList } from 'carbon-addons-iot-react';
import { css } from 'emotion';

const fragmentLayersStyle = css`
	.iot--list--page {
		display: none;
	}
`;

const getHierarchyListItemsFromComponentObj = (componentObj: any) => {
	if (!componentObj) {
		return null;
	}

	return {
		id: componentObj.id,
		content: {
			value: componentObj.type
		},
		children: componentObj.items?.map((item: any) => getHierarchyListItemsFromComponentObj(item))
	};
};

const getComponentObjById = (id: string, componentObj: any) => {
	if (componentObj.id === id) {
		return componentObj;
	}

	if (!componentObj.items) {
		return undefined;
	}

	for (const item of componentObj.items) {
		const foundComponentObj: any = getComponentObjById(id, item);
		if (foundComponentObj) {
			return foundComponentObj;
		}
	}
	return undefined;
};

const getReorderedComponentObjFromHierarchyListItem = (hierchyListItem: any, componentObj: any) => {
	if (!hierchyListItem) {
		return undefined;
	}

	const component = getComponentObjById(hierchyListItem.id, componentObj);

	if (!component) {
		return undefined;
	}

	return {
		...component,
		items: hierchyListItem.children?.map((child: any) => getReorderedComponentObjFromHierarchyListItem(child, componentObj))
	};
};

export const FragmentLayers = ({ fragment, setFragment }: any) => {
	return <HierarchyList
		title="Layers"
		className={fragmentLayersStyle}
		items={getHierarchyListItemsFromComponentObj(fragment.data)?.children}
		onListUpdated={(updatedItems: any[]) => {
			setFragment({
				...fragment,
				data: getReorderedComponentObjFromHierarchyListItem({ id: 1, children: updatedItems }, fragment.data)
			});
		}}
		editingStyle="single"
	/>;
};
