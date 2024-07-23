import React from 'react';

import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/list.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
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
				value: 'Item'
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
	keywords: ['list', 'unordered', 'ordered', 'items'],
	name: 'List',
	type: 'list',
	defaultComponentObj: {
		type: 'list',
		items: [
			{ value: 'Item' }
		]
	},
	image: image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}List = ${JSON.stringify(json.items)}`,
				outputs: (_) => '',
				imports: ['ListModule'],
				code: ({ json }) => {
					const listElement = json.isOrderedList? 'ol' : 'ul';
					return `<${listElement} cdsList
						${angularClassNamesFromComponentObj(json)}>
						<li cdsListItem *ngFor="let item of ${nameStringToVariableString(json.codeContext?.name)}List">{{item.value}}</li>
					</${listElement}>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}List = ${JSON.stringify(json.items)}`,
				outputs: (_) => '',
				imports: ['ListModule'],
				code: ({ json }) => {
					const listElement = json.isOrderedList? 'ol' : 'ul';
					return `<${listElement} ibmList
						${angularClassNamesFromComponentObj(json)}>
						<li ibmListItem *ngFor="let item of ${nameStringToVariableString(json.codeContext?.name)}List">{{item.value}}</li>
					</${listElement}>`;
				}
			}
		},
		react: {
			latest: {
				imports: ({ json }) => [json.isOrderedList ? 'OrderedList' : 'UnorderedList'].concat(json.items.length > 0 ? ['ListItem'] : []),
				code: ({ json }) => {
					const listComponent = json.isOrderedList? 'OrderedList' : 'UnorderedList';
					return `<${listComponent} ${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<ListItem key="${index}">${element.value}</ListItem>`).join('\n')}
                    </${listComponent}>`;
				}
			},
			v10: {
				imports: ({ json }) => [json.isOrderedList ? 'OrderedList' : 'UnorderedList'].concat(json.items.length > 0 ? ['ListItem'] : []),
				code: ({ json }) => {
					const listComponent = json.isOrderedList? 'OrderedList' : 'UnorderedList';
					return `<${listComponent} ${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<ListItem key="${index}">${element.value}</ListItem>`).join('\n')}
                    </${listComponent}>`;
				}
			}
		}
	}
};
