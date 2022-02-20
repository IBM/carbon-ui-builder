import React, { useEffect } from 'react';
import {
	TextInput,
	Checkbox,
	SelectableTile,
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { Add32 } from '@carbon/icons-react';
import { getParentComponent, updatedState } from '../../components';
import { css, cx } from 'emotion';
import { useFragment } from '../../context';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '..';
import image from '../../assets/component-icons/tile-selectable.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';



export const ASelectableTileStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		{selectedComponent.standalone &&
			<TileMorphism component={selectedComponent} setComponent={setComponent} />}
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
		{selectedComponent.standalone &&
			<Checkbox
				labelText='Light theme'
				id='theme-select'
				checked={selectedComponent.light}
				onChange={(checked: any) => {
					setComponent({
						...selectedComponent,
						light: checked
					})
				}}
			/>}
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
					standalone: false,
					type: 'selectabletile',
					value: 'value',
					items: [{ type: 'text', text: 'New selectable tile' }]
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	/**
	 * Removing `for` attribute so users can select text and other non-form elements.
	 */
	useEffect(() => {
		const tileElement = document.getElementById(componentObj.id);
		const labelElement = tileElement?.parentElement?.querySelector('label.bx--tile.bx--tile--selectable');
		labelElement?.removeAttribute('for');
	});

	return <>
		{parentComponent.tileGroup && <span className={cx(addStyleTop, selected ? css`` : css`display: none`)}>
			<Add32 onClick={(event: any) => {
				event.stopPropagation();
				addTile();
			}} className={iconStyle} />
		</span>}

		<AComponent
			componentObj={componentObj}
			className={css`display: block;`}
			selected={selected}
			{...rest}>
			<SelectableTile
				id={componentObj.id.toString()}
				value={componentObj.value}
				light={componentObj.light}
				selected={componentObj.selected}
				disabled={componentObj.disabled}
				onDrop={onDrop}>
				{children}
			</SelectableTile>
		</AComponent>

		{parentComponent.tileGroup && <span className={cx(addStyle, selected ? css`` : css`display: none`)}>
			<Add32 onClick={(event: any) => {
				event.stopPropagation();
				addTile(1);
			}} className={iconStyle} />
		</span>}
	</>;
};

export const componentInfo: ComponentInfo = {
	component: ASelectableTile,
	styleUI: ASelectableTileStyleUI,
	codeUI: ASelectableTileCodeUI,
	keywords: ['tile', 'card', 'multi', 'selectable'],
	name: 'Selectable tile',
	defaultComponentObj: {
		type: 'selectabletile',
		standalone: true,
		value: 'value',
		title: 'title',
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
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) =>
				`@Input() ${nameStringToVariableString(json.codeContext?.name)}selected = "${json.selected}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}value = ${json.value};`,
			outputs: ({ json }) =>
				`@Output() ${nameStringToVariableString(json.codeContext?.name)}Change = new EventEmitter<Event>();`,
			imports: ['TileModule'],
			code: ({ json, jsonToTemplate }) => {
				/**
				 * @todo - CCA does not support light
				 * https://github.com/IBM/carbon-components-angular/issues/1999
				 */
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
					${json.standalone ? `onChange={handleInputChange}` : ''}
					value={${json.value}}
					title={${json.title}}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</SelectableTile>`;
			}
		}
	}
};
