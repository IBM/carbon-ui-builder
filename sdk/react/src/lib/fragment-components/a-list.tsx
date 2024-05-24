import React from 'react';

import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/list.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../helpers/tools';
import {
	TextInput,
	OrderedList,
	UnorderedList,
	ListItem,
	Checkbox
} from '@carbon/react';
import { DraggableTileList } from '../helpers/draggable-list';

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
		<Checkbox
			labelText='Ordered'
			id='checkbox-ordered'
			checked={selectedComponent.isOrderedList}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isOrderedList: checked
		})} />
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
	componentObj,
	selected,
	...rest
}: any) => {
	const ListComponent = componentObj.isOrderedList? OrderedList : UnorderedList;
	return (
		<AComponent
		selected={selected}
		componentObj={componentObj}
		{...rest}>
			<ListComponent>
				{
					componentObj.items?.map((item: any, index: any) => <ListItem key={index}>{item.value}</ListItem>)
				}
			</ListComponent>
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
		isOrderedList: false,
		items: [
			{ value: 'Item' }
		]
	},
	image: image,
	hideFromElementsPane: false,
	codeExport: {
		angular: {
			latest: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['ListModule'],
				code: ({ json }) => {
					const listElement = json.isOrderedList? 'ol' : 'ul';
					return `<${listElement} cdsList
						${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<li cdsListItem key=${index}>${element.value}</li>`).join('\n')}
					</${listElement}>`;
				}
			},
			v10: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['ListModule'],
				code: ({ json }) => {
					const listElement = json.isOrderedList? 'ol' : 'ul';
					return `<${listElement} ibmList
						${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<li ibmListItem key=${index}>${element.value}</li>`).join('\n')}
					</${listElement}>`;
				}
			}
		},
		react: {
			latest: {
				imports: ({ json }) => [json.isOrderedList ? 'OrderedList' : 'UnorderedList'],
				code: ({ json }) => {
					const listComponent = json.isOrderedList? 'OrderedList' : 'UnorderedList';
					return `<${listComponent} ${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<ListItem key=${index}>${element.value}</ListItem>`).join('\n')}
                    </${listComponent}>`;
				}
			},
			v10: {
				imports: ({ json }) => [json.isOrderedList ? 'OrderedList' : 'UnorderedList'],
				code: ({ json }) => {
					const listComponent = json.isOrderedList? 'OrderedList' : 'UnorderedList';
					return `<${listComponent} ${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<ListItem key=${index}>${element.value}</ListItem>`).join('\n')}
                    </${listComponent}>`;
				}
			}
		}
	}
};
