import React, { useEffect, useState } from 'react';
import { HierarchyList } from 'carbon-addons-iot-react';
import {
	TextInput,
	OrderedList,
	Accordion,
	AccordionItem,
	Button
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { useFragment } from '../context';
import { css, cx } from 'emotion';
import {
	Add16,
	TrashCan16
} from '@carbon/icons-react';
import {
	getParentComponent
} from '../components';
import image from './../assets/component-icons/radio.svg';
import {
	angularClassNamesFromComponentObj,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { actionIconStyle } from '../routes';

const LayoutStyle = css`
	.iot--list--page {
		display: none;
	}
`;
const OrderedListStyle = css`
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

const ListItemsWidget = ({ setComponent, title }: any) => {
	const [fragment, setFragment] = useFragment();
	const addToList = (id: any) => {
		const component = getComponentObjById(id, fragment.data);
		const dataList = [...component.items];
		const newChildObject = {
			type: 'listItem',
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
		const parentComponent = getParentComponent(fragment.data, componentObj);
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
						<Add16 className={actionIconStyle} />
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
						<TrashCan16 className={actionIconStyle} />
					</Button>
				</>
			},
			children: componentObj.items?.map((item: any) => getHierarchyListItemsFromComponentObj(item))
		};
	};

	return <HierarchyList
		title={title}
		className={LayoutStyle}
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

export const AListSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const [isAccordionOpen, setIsAccordionOpen] = useState({} as any);
	useEffect(() => {
		setIsAccordionOpen({
			small: selectedComponent.smallSpan || selectedComponent.smallOffset
		});
	}, [selectedComponent]);
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
		<Accordion align='start'>
			<AccordionItem
			id={selectedComponent.id}
			title='Items list'
			className='layout-widget'
			open={isAccordionOpen.small}>
				<ListItemsWidget selectedComponent={selectedComponent} setComponent={setComponent}/>
			</AccordionItem>
		</Accordion>
	</>;
};

export const AListCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
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
};

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
				<legend className={cx(css`margin-left: 3px;`, 'bx--label')}>
					{componentObj.legendName}
				</legend>
				<OrderedList className={OrderedListStyle}>
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
		legendName: 'Ordered List',
		items: [
			{
				type: 'listItem',
				value: 'Item',
				items: []
			},
			{
				type: 'listItem',
				value:  'Item',
				items: []
			}
		]
	},
	image: image,
	hideFromElementsPane: false,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['ListModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ol ibmList
					${angularClassNamesFromComponentObj(json)}>
					${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ol>`;
			}
		},
		react: {
			imports: ['OrderedList'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<OrderedList
					${reactClassNamesFromComponentObj(json)}>
					${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</OrderedList>`;
			}
		}
	}
};
