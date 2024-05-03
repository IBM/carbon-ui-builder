import React from 'react';

import { AComponent, ComponentInfo } from './a-component';

import { css, cx } from 'emotion';
import {
	Add,
	TrashCan,
	Edit
} from '@carbon/icons-react';

import image from './../assets/component-icons/list.svg';
import { angularClassNamesFromComponentObj, getParentComponent, reactClassNamesFromComponentObj } from '../helpers/tools';
import { Button, TextInput, OrderedList } from '@carbon/react';
import { DraggableTileList } from '../helpers/draggable-list';

import { actionIconStyle } from '../helpers/styles';

const layoutStyle = css`
	.iot--list--page {
		display: none;
	}
`;

const orderedListStyle = css`
	margin-left: 20px;
	list-style: auto;
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

const ListItemsWidget = ({ selectedComponent, setComponent, title }: any) => {
	const addToList = (id: any) => {
		const component = getComponentObjById(id, selectedComponent.data);

		const dataList = [...component.items];
		const newChildObject = {
			type: 'list-item',
			value: 'Item',
			items: []
		};
		const updateList = (newList: any[]) => {
			setComponent({
				...component,
				items: newList
			});
		};
		dataList.push(newChildObject);
		updateList(dataList);
	};

	const deleteFromList = (componentObj: any) => {
		const parentComponent = getParentComponent(selectedComponent.data, componentObj);

		const dataList = [...parentComponent.items];
		const updateList = (newList: any[]) => {
			setComponent({
				...parentComponent,
				items: newList
			});
		};
		const index = dataList.findIndex((o) => o.id === componentObj.id);
		if (index !== -1) {
			dataList.splice(index, 1);
		}
		updateList(dataList);
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
	const getHierarchyListItemsFromComponentObj = (componentObj: any) => {
		if (!componentObj) {
			return null;
		}
		return {
			id: componentObj.id,
			content: {
				value: componentObj.value ? componentObj.value : componentObj.type,
				rowActions: () => <>
					<Button
						id={componentObj.id}
						kind='ghost'
						aria-label='Add Children'
						title='Add Children'
						onClick={(event: any) => {
							event.stopPropagation();
							addToList(event.currentTarget.id);
						}}>
						<Add className={actionIconStyle} />
					</Button>
					<Button
						id={componentObj.id}
						kind='ghost'
						aria-label='Delete'
						title='Delete'
						onClick={(event: any) => {
							event.stopPropagation();
							deleteFromList(componentObj);
						}}>
						<TrashCan className={actionIconStyle} />
					</Button>
					<Button
						kind='ghost'
						aria-label='Edit'
						title='Edit'
						onClick={() => {}}>
						<Edit className={actionIconStyle} />
					</Button>
				</>
			},
			children: componentObj.items?.map((item: any) => getHierarchyListItemsFromComponentObj(item))
		};
	};
	const itemsList = {
		data: {
			id: selectedComponent.id, // selectedComponent.data.id,
			items: [
				{
					type: selectedComponent.type,
					id: selectedComponent.id,
					items: selectedComponent.items
				}
			]
		}
	};

	return <OrderedList
		title={title}
		hasSearch={true}
		className={layoutStyle}
		items={getHierarchyListItemsFromComponentObj(itemsList.data)?.children}
		onListUpdated={(updatedItems: any[]) => {
			itemsList.data = getReorderedComponentObjFromHierarchyListItem({ id: 1, children: updatedItems }, itemsList.data);
			setComponent({
				...selectedComponent,
				items: itemsList.data.items[0].items
			});
		}}
		editingStyle='single'
	/>;
};

export const AListSettingsUI = ({ selectedComponent, setComponent }: any) => {

	const handleItemUpdate = (key: string, value: any, index: number) => {
		const item = {
			...selectedComponent.items[index],
			[key]: value
		};
		setComponent({
			...selectedComponent,
			items: [
				...selectedComponent.items.slice(0, index),
				item,
				...selectedComponent.items.slice(index + 1)
			]
		});
	};

	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};

	const template = (item: any, index: number) => {
		return <TextInput
			id={`list-display-item-${index}-text-input`}
			light
			value={item.value}
			labelText='Display text'
			onChange={(event: any) => handleItemUpdate('value', event.currentTarget.value, index)}
		/>;
	};

	return <>
		<TextInput
		value={selectedComponent.legendName}
		labelText='Legend name'
		placeholder='Legend name'
		onChange={(event: any) => {
			setComponent({
				...selectedComponent,
				legendName: event.currentTarget.value
			});
		}} />
		<hr />
		<h4>Items</h4>
		<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={handleItemUpdate}
			defaultObject={{
				value: 'Text'
			}}
			template={template} />
		<hr />
	</>;
};

export const AListCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	labelText='Input name'
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			codeContext: {
				...selectedComponent.codeContext,
				name: event.currentTarget.value
			}
		});
	}}
/>;

export const AList = ({
	children,
	componentObj,
	selected,
	...rest
}: any) => {
	return (
		<AComponent
		selected={selected}
		headingCss={css`width: fit-content; min-width: 9rem;`}
		componentObj={componentObj}
		{...rest}>
			<legend className={cx('bx--label', css`margin-left: 3px;`)}>
				{componentObj.legendName}
			</legend>
			<OrderedList className={orderedListStyle}>
				{children}
			</OrderedList>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AList,
	settingsUI: AListSettingsUI,
	codeUI: AListCodeUI,
	keywords: ['list'],
	name: 'List',
	type: 'list',
	defaultComponentObj: {
		type: 'list',
		legendName: 'Ordered list',
		items: [
			{
				// type: 'list-item',
				value: 'Item',
				// items: []
			},
			{
				// type: 'list-item',
				value:  'Item',
				// items: []
			}
		],
		cssClasses: [{ id: 'margin-left', content: 'margin-left: 30px;' }]
	},
	image: image,
	hideFromElementsPane: false,
	codeExport: {
		angular: {
            latest: {
                inputs: (_) => '',
                outputs: (_) => '',
                imports: ['ListModule'],
                code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
                    return `<ol ibmList
                        ${angularClassNamesFromComponentObj(json)}>
                        ${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
                    </ol>`;
                }
            },
            v10: {
                inputs: (_) => '',
                outputs: (_) => '',
                imports: ['ListModule'],
                code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
                    return `<ol ibmList
                        ${angularClassNamesFromComponentObj(json)}>
                        ${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
                    </ol>`;
                }
            }

		},
		react: {
            latest: {
                imports: ['OrderedList'],
                code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
                    return `<OrderedList
                        ${reactClassNamesFromComponentObj(json)}>
                        ${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
                    </OrderedList>`;
                }
            },
            v10: {
                imports: ['OrderedList'],
                code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
                    return `<OrderedList
                        ${reactClassNamesFromComponentObj(json)}>
                        ${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
                    </OrderedList>`;
                }
            }
		}
	}
};
