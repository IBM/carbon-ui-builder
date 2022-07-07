import React from 'react';
import {
	OrderedList,
	TextInput,
	ListItem
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { css } from 'emotion';
import {
	angularClassNamesFromComponentObj,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const AListItemSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
		value={selectedComponent.value}
		labelText='Label'
		onChange={(event: any) => {
			setComponent({
				...selectedComponent,
				value: event.currentTarget.value
			});
		}} />;
};

export const AListItemCodeUI = ({ selectedComponent, setComponent }: any) => {
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
			}} />;
};

export const AListItem = ({
	componentObj,
	selected,
	...rest
}: any) => {
	function getChildren(step: any, child = false) {
		if (!step.items) {
			return;
		}
		return 	<ListItem className={css`cursor:pointer`}>
					{step.value}
					{step.items.length > 0 ? <OrderedList nested={child}>
							{step.items.map((innerStep: any) => getChildren(innerStep, true))}
						</OrderedList>
					: [] }
			</ListItem>;
	}
	return (
		<AComponent
		selected={selected}
		headingCss={css`width: fit-content; min-width: 9rem;`}
		componentObj={componentObj}
		{...rest}>
			{
				<ListItem className={css`cursor:pointer`}>
					{componentObj.value}
					{componentObj.items.length > 0 ? <OrderedList nested={true}>
							{componentObj.items.map((step: any) => getChildren(step, true))}
						</OrderedList>
					: [] }
				</ListItem>
			}
		</AComponent>
	);
};

function getChildrenExportReact(step: any, child = false) {
	if (!step.items) {
		return;
	}
	return `<ListItem>
				${step.value}
				${step.items.length > 0 ? `<OrderedList nested={${child}}>
						${step.items.map((innerStep: any) => getChildrenExportReact(innerStep, true)).join('\n')}
					</OrderedList>`
				: '' }
		</ListItem>`;
}

function getChildrenExportAngular(step: any) {
	if (!step.items) {
		return;
	}
	return `<li ibmListItem>
				${step.value}
				${step.items.length > 0 ? `<ol ibmList>
					${step.items.map((innerStep: any) => getChildrenExportAngular(innerStep)).join('\n')}
				</ol>` : ''}
			</li>`;
}

export const componentInfo: ComponentInfo = {
	component: AListItem,
	settingsUI: AListItemSettingsUI,
	codeUI: AListItemCodeUI,
	render: ({ componentObj, select, remove, selected }) => <AListItem
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.value}
	</AListItem>,
	keywords: ['list', 'item'],
	name: 'List item',
	type: 'listItem',
	defaultComponentObj: {
		type: 'listItem'
	},
	image: undefined,
	hideFromElementsPane: true,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['ListModule'],
			code: ({ json }) => {
				return `<li ibmListItem>
					${json.value}
					${angularClassNamesFromComponentObj(json)}
					${json.items.length > 0 ? `<ol ibmList>
						${json.items.map((step: any) => getChildrenExportAngular(step)).join('\n')}
					</ol>` : '' }
				</li>`;
			}
		},
		react: {
			imports: ['ListItem'],
			code: ({ json }) => {
				return `<ListItem>
					${json.value}
					${reactClassNamesFromComponentObj(json)}
					${json.items.length > 0 ? `<OrderedList nested={true}>
						${json.items.map((step: any) => getChildrenExportReact(step, true)).join('\n')}
					</OrderedList>` : '' }
				</ListItem>`;
			}
		}
	}
};
