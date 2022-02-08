import React from 'react';
import {
	TextInput,
	Checkbox,
	SelectableTile,
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { Add32 } from '@carbon/icons-react';
import { getParentComponent, updatedState } from '../../components';
import { css, cx } from 'emotion';
import { useFragment } from '../../context';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '..';

import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';


export const ASelectableTileStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			value={selectedComponent.value}
			labelText='Tile value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						value: event.currentTarget.value
					}
				});
			}}
		/>
		<TextInput
			value={selectedComponent.name}
			labelText='Input name attribute'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						name: event.currentTarget.value
					}
				});
			}}
		/>
		<Checkbox
			labelText='Selected'
			id='selected'
			checked={selectedComponent.selected}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					selected: checked
				})
			}}
		/>
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				})
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ASelectableTileCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
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
		/>
	</>
};


const addStyle = css`
	position: absolute;
	margin-top: -2px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
	z-index: 1;
`;

const addStyleTop = cx(addStyle, css`
	margin-top: -18px;
`);


const iconStyle = css`
	height: 1rem;
	width: 1rem;
	float: right;
	cursor: pointer`;

export const ASelectableTile = ({
	children,
	componentObj,
	onDrop,
	selected,
	renderComponents,
	...rest
}: any) => {

	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addTile = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'selectabletile',
					items: [{ type: 'text', text: 'New selectable tile' }]
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	return <>
		<span className={cx(addStyleTop, selected ? css`` : css`display: none`)}>
			<Add32 onClick={(event: any) => {
				event.stopPropagation();
				addTile();
			}} className={iconStyle} />
		</span>

		<AComponent
			componentObj={componentObj}
			className={css`display: block;`}
			selected={selected}
			{...rest}>
			<SelectableTile
				id={componentObj.id}
				light={componentObj.light}
				selected={componentObj.selected}
				disabled={componentObj.disabled}
				onDrop={onDrop}>
				{children}
			</SelectableTile>
		</AComponent>

		<span className={cx(addStyle, selected ? css`` : css`display: none`)}>
			<Add32 onClick={(event: any) => {
				event.stopPropagation();
				addTile(1);
			}} className={iconStyle} />
		</span>
	</>;
};

export const componentInfo: ComponentInfo = {
	component: ASelectableTile,
	styleUI: ASelectableTileStyleUI,
	codeUI: ASelectableTileCodeUI,
	keywords: ['tile', 'card', 'multi', 'selectable'],
	name: 'Selectable Tile',
	defaultComponentObj: {
		type: 'selectabletile',
		/**
		 * Value & title, light are default props
		 * @todo
		 * CCA does not support light
		 */
		value: 'value',
		title: 'title',
		light: false,
		disabled: false,
		selected: false,
		items: [],
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <ASelectableTile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
		{componentObj.items.map((tile: any) => (
			renderComponents(tile)
		))}
	</ASelectableTile>,
	/**
	 * Can only be added via tile-group or by clicking `plus` icon on top or bottom of existing SelectableTile
	 */
	hideFromElementsPane: true,
	image: undefined,
	codeExport: {
		angular: {
			inputs: ({ json }) =>
				`@Input() ${nameStringToVariableString(json.codeContext?.name)}selected = "${json.selected}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}value = ${json.value};`,
			outputs: ({ json }) =>
				`@Output() ${nameStringToVariableString(json.codeContext?.name)}Change = new EventEmitter<Event>();`,
			imports: ['TileModule'],
			code: ({ json, jsonToTemplate }) => {
				return `<ibm-selection-tile
					[value]="${nameStringToVariableString(json.codeContext?.name)}value}"
					[selected]="${nameStringToVariableString(json.codeContext?.name)}selected"
					(change)="${nameStringToVariableString(json.codeContext?.name)}Change.emit($event)"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
					</ibm-selection-tile>`
			}
		},
		react: {
			imports: ['SelectableTile'],
			code: ({ json, jsonToTemplate }) => {
				return `<SelectableTile
					${json.selected !== undefined ? `selected="${json.selected}"` : ''}
					${json.light !== undefined ? `light="${json.light}"` : ''}
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${json.name !== undefined ? `disabled={${json.name}}` : ''}
					value={${json.value}}
					title={${json.title}}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</SelectableTile>`;
			}
		}
	}
};
