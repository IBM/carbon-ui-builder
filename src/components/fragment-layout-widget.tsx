import React from 'react';
import { Button } from 'carbon-components-react';
import { HierarchyList } from 'carbon-addons-iot-react';
import {
	Edit16,
	TrashCan16
} from '@carbon/icons-react';
import { css } from 'emotion';
import { actionIconStyle } from '../routes';
import { stateWithoutComponent } from './fragment';

const fragmentLayoutStyle = css`
	.iot--list--page {
		display: none;
	}
`;

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

export const FragmentLayoutWidget = ({ fragment, setFragment, title }: any) => {
	const getHierarchyListItemsFromComponentObj = (componentObj: any) => {
		if (!componentObj) {
			return null;
		}

		return {
			id: componentObj.id,
			content: {
				value: componentObj.type,
				rowActions: () => <>
					<Button
						kind='ghost'
						aria-label='Edit'
						title='Edit'
						onClick={() => setFragment({
							...fragment,
							selectedComponentId: componentObj.id
						}, true)}>
						<Edit16 className={actionIconStyle} />
					</Button>
					<Button
						kind='ghost'
						aria-label='Delete'
						title='Delete'
						onClick={() => setFragment({
							...fragment,
							// for whatever reason it's reporting this problem here for .data
							// eslint-disable-next-line react/prop-types
							data: stateWithoutComponent(fragment.data, componentObj.id)
						})}>
						<TrashCan16 className={actionIconStyle} />
					</Button>
				</>
			},
			children: componentObj.items?.map((item: any) => getHierarchyListItemsFromComponentObj(item))
		};
	};

	return <HierarchyList
		title={title}
		className={fragmentLayoutStyle}
		items={getHierarchyListItemsFromComponentObj(fragment.data)?.children}
		onListUpdated={(updatedItems: any[]) => {
			setFragment({
				...fragment,
				data: getReorderedComponentObjFromHierarchyListItem({ id: 1, children: updatedItems }, fragment.data)
			});
		}}
		editingStyle='single'
	/>;
};
