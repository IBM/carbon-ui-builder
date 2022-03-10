import React from 'react';
import { TextInput, Checkbox } from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '../';

import image from '../../assets/component-icons/tile-radio.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const ARadioTileGroupStyleUI = ({ selectedComponent, setComponent }: any) => {
	/**
	 * It usually is not common for users to have different theme for each tile,
	 * this approach will ensure users don't have to go through each `tile` & update theme
	 *
	 * Iterates through all children & updates their theme
	 */
	const updateChildrenTheme = (isLight: boolean) => {
		selectedComponent.items.forEach((item: any) => {
			item.light = isLight;
		});
	}

	// Radio form elements within a fieldset should have the same name
	const updateChildrenFormItemName = (name: string) => {
		selectedComponent.items.forEach((item: any) => {
			item.formItemName = name;
		});
	}

	return <>
		<TileMorphism component={selectedComponent} setComponent={setComponent} />
		<TextInput
			value={selectedComponent.formItemName}
			labelText='Form item name'
			id='form-item-name'
			onChange={(event: any) => {
				updateChildrenFormItemName(event.currentTarget.value);
				setComponent({
					...selectedComponent,
					formItemName: event.currentTarget.value,
				});
			}}
		/>
		<TextInput
			value={selectedComponent.legend}
			labelText='Legend name'
			id='legend-name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					legend: event.currentTarget.value,
				});
			}}
		/>
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => {
				updateChildrenTheme(checked);
				setComponent({
					...selectedComponent,
					light: checked
				});
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
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ARadioTileGroupCodeUI = ({ selectedComponent, setComponent }: any) => {
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
	/>
};

export const ARadioTileGroup = ({
	children,
	componentObj,
	selected,
	renderComponents,
	...rest
}: any) => {
	return <AComponent
		componentObj={componentObj}
		className={css`display: block;`}
		selected={selected}
		{...rest}>
		<fieldset className="bx--tile-group" disabled={componentObj.disabled}>
			<legend className="bx--label">{componentObj.legend}</legend>
			{children}
		</fieldset>
	</AComponent>
};

export const componentInfo: ComponentInfo = {
	component: ARadioTileGroup,
	styleUI: ARadioTileGroupStyleUI,
	codeUI: ARadioTileGroupCodeUI,
	keywords: ['tile', 'card', 'radio', 'select'],
	name: 'Radio tile group',
	defaultComponentObj: {
		type: 'radioTileGroup',
		tileGroup: true,
		formItemName: 'tile-group',
		legend: 'Radio Tile Group',
		items: [
			{
				type: 'radiotile',
				value: 'Tile 1',
				formItemName: 'tile-group',
				items: [{ type: 'text', text: 'A' }]
			},
			{
				type: 'radiotile',
				value: 'Tile 2',
				formItemName: 'tile-group',
				items: [{ type: 'text', text: 'B' }]
			},
			{
				type: 'radiotile',
				value: 'Tile 3',
				formItemName: 'tile-group',
				items: [{ type: 'text', text: 'C' }]
			}
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <ARadioTileGroup
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
		{componentObj.items.map((tile: any) => (
			renderComponents(tile)
		))}
	</ARadioTileGroup>,
	image,
	codeExport: {
		angular: {
			inputs: (_) => ``,
			outputs: ({ json }) =>
				`@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter<Event>();`,
			imports: ['TilesModule'],
			code: ({ json, jsonToTemplate }) => {
				return `<ibm-tile-group
					(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
					[multiple]="false"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ibm-tile-group>`
			}
		},
		react: {
			imports: ['TileGroup'],
			code: ({ json, jsonToTemplate }) => {
				return `<TileGroup
					legend="${json.legend}"
					name="${json.formItemName}"
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</TileGroup>`;
			}
		}
	}
};
