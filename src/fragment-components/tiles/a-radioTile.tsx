import React, { useEffect } from 'react';
import {
	TextInput,
	Checkbox,
	RadioTile,
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './converter';
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


export const ARadioTileStyleUI = ({ selectedComponent, setComponent }: any) => {

	const [fragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, selectedComponent);

	const updateParentDefaultChecked = (checked: boolean) => {
		if (!checked && parentComponent.defaultChecked) {
			delete parentComponent.defaultChecked;
		} else {
			parentComponent.items.forEach((item: any) => {
				item.defaultChecked = false;
			});

			parentComponent.defaultChecked = selectedComponent.value;
		}
	}

	if (!selectedComponent.radioID) {
		setComponent({
			...selectedComponent,
			radioID: selectedComponent.id.toString()
		})
	}

	return <>
		<TileMorphism component={selectedComponent} componentSetter={setComponent} />
		<TextInput
			value={selectedComponent.radioID}
			labelText='Radio input ID'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						radioID: event.currentTarget.value
					}
				});
			}}
		/>
		<TextInput
			value={selectedComponent.value}
			labelText='Radio value'
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
		<Checkbox
			labelText='Default checked'
			id='default-checked'
			checked={selectedComponent.defaultChecked}
			onChange={(defaultChecked: any) => {
				updateParentDefaultChecked(defaultChecked);
				setComponent({
					...selectedComponent,
					defaultChecked
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

export const ARadioTileCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const ARadioTile = ({
	children,
	componentObj,
	onDrop,
	selected,
	renderComponents,
	...rest
}: any) => {

	// Removing `for` attribute so users can select text and other non-form elements.
	useEffect(() => {
		const tileElement = document.getElementById(componentObj.id);
		const labelElement = tileElement?.parentElement?.querySelector('label.bx--tile.bx--tile--selectable');
		labelElement?.removeAttribute('for');
	});

	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addRadio = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'radiotile', value: 'Tile 1', formItemName: componentObj.formItemName,
					items: [{ type: 'text', text: 'New radio tile' }]
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
				addRadio();
			}} className={iconStyle} />
		</span>
		<AComponent
			componentObj={componentObj}
			className={css`display: block;`}
			selected={selected}
			{...rest}>
			<RadioTile
				id={componentObj?.radioID || componentObj.id.toString()}
				name={componentObj.formItemName}
				light={componentObj.light}
				checked={componentObj.defaultChecked}
				disabled={componentObj.disabled}
				value={componentObj.value}
				onDrop={onDrop}>
				{children}
			</RadioTile>
		</AComponent>

		<span className={cx(addStyle, selected ? css`` : css`display: none`)}>
			<Add32 onClick={(event: any) => {
				event.stopPropagation();
				addRadio(1);
			}} className={iconStyle} />
		</span>
	</>
};

export const componentInfo: ComponentInfo = {
	component: ARadioTile,
	styleUI: ARadioTileStyleUI,
	codeUI: ARadioTileCodeUI,
	keywords: ['tile', 'card', 'radio', 'selectable'],
	name: 'Selectable Tile',
	defaultComponentObj: {
		type: 'radiotile',
		radioID: '',
		formItemName: 'tile-group',
		disabled: false,
		checked: false,
		items: [],
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <ARadioTile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
		{componentObj.items.map((tile: any) => (
			renderComponents(tile)
		))}
	</ARadioTile>,
	/**
	 * Can only be added by adding tile-group or by clicking `plus` icon on top or bottom
	 * of existing RadioTile
	 */
	hideFromElementsPane: true,
	image: undefined,
	codeExport: {
		angular: {
			inputs: ({ json }) =>
				`@Input() ${nameStringToVariableString(json.codeContext?.name)}selected = "${json.selected}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}value = ${json.value};`,
			outputs: (_) => ``,
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
			imports: ['RadioTile'],
			code: ({ json, jsonToTemplate }) => {
				return `<RadioTile
					${json.id !== undefined ? `id="${json.id}"` : ''}
					${json.light !== undefined ? `light="${json.light}"` : ''}
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					value="${json.value}"
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</RadioTile>`;
			}
		}
	}
};
