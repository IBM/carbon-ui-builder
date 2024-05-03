import React from 'react';

import { AComponent, ComponentInfo } from './a-component';
import { css, cx } from 'emotion';
import image from './../assets/component-icons/list.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../helpers/tools';
import { TextInput, OrderedList, ListItem } from '@carbon/react';
import { DraggableTileList } from '../helpers/draggable-list';

const orderedListStyle = css`
	margin-left: 30px;
`;

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
				{
					componentObj.items?.map((item: any, index: any) => <ListItem key={index}>{item.value}</ListItem>)
				}
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
			{ value: 'Item' }
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
				code: ({ json }) => {
					return `<ol cdsList
                        ${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<li cdsListItem key=${index}>${element.value}</li>`).join('\n')}
                    </ol>`;
				}
			},
			v10: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['ListModule'],
				code: ({ json }) => {
					return `<ol cdsList
                        ${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<li cdsListItem key=${index}>${element.value}</li>`).join('\n')}
                    </ol>`;
				}
			}

		},
		react: {
			latest: {
				imports: ['OrderedList'],
				code: ({ json }) => {
					return `<OrderedList
                        ${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<ListItem key=${index}>${element.value}</ListItem>`).join('\n')}
                    </OrderedList>`;
				}
			},
			v10: {
				imports: ['OrderedList'],
				code: ({ json }) => {
					return `<OrderedList
                        ${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any, index: any) => `<ListItem key=${index}>${element.value}</ListItem>`).join('\n')}
                    </OrderedList>`;
				}
			}
		}
	}
};
