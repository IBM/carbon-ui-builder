import React from 'react';
import { Button } from '@carbon/react';
import {
	Edit,
	TrashCan,
	Book
} from '@carbon/react/icons';
import { css } from 'emotion';
import { actionIconStyle } from '../routes';
import { stateWithoutComponent } from './fragment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fragmentLayoutStyle = css`
	margin-left: 1px;

	.iot--list--page {
		display: none;
	}

	.iot--list-item-editable--drag-preview {
		right: 99999999px;
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		items: hierchyListItem.children?.map((child: any) => getReorderedComponentObjFromHierarchyListItem(child, componentObj))
	};
};

export const FragmentLayoutWidget = ({ fragment, setFragment }: any) => {
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
						}, false)}>
						<Edit size={16} className={actionIconStyle} />
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
						<TrashCan size={16} className={actionIconStyle} />
					</Button>
				</>
			},
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			children: componentObj.items?.map((item: any) => getHierarchyListItemsFromComponentObj(item))
		};
	};

	return <div className={css`text-align: center; padding-bottom: 1rem;`}><Book size={32} /></div>;
};
