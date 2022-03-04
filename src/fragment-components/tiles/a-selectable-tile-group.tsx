import React from 'react';
import {
	TextInput,
	Checkbox,
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '..';

import image from '../../assets/component-icons/tile-selectable-group.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const ASelectableTileGroupStyleUI = ({ selectedComponent, setComponent }: any) => {
	/**
	 * It usually is not common for users to have different theme for each tile,
	 * this approach will ensure they don't have to go through each `tile` & update theme
	 *
	 * Iterates through all children & updates their theme
	 */
	const updateChildrenTheme = (isLight: boolean) => {
		selectedComponent.items.forEach((item: any) => {
			item.light = isLight;
		})
	}

	return <>
		<TileMorphism component={selectedComponent} setComponent={setComponent} />
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => {
				updateChildrenTheme(checked);
				setComponent({
					...selectedComponent,
					light: checked
				})
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ASelectableTileGroupCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const ASelectableTileGroup = ({
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
		<div role="group" aria-label="Selectable tiles">
			{children}
		</div>
	</AComponent>;
};

export const componentInfo: ComponentInfo = {
	component: ASelectableTileGroup,
	styleUI: ASelectableTileGroupStyleUI,
	codeUI: ASelectableTileGroupCodeUI,
	keywords: ['tile', 'card', 'multi', 'select'],
	name: 'Selectable tile group',
	defaultComponentObj: {
		type: 'selectableTileGroup',
		tileGroup: true,
		items: [
			{
				type: 'selectabletile',
				standalone: false,
				title: 'title',
				value: 'a',
				items: [{ type: 'text', text: 'A' }]
			},
			{
				type: 'selectabletile',
				standalone: false,
				title: 'title',
				value: 'b',
				items: [{ type: 'text', text: 'B' }]
			},
			{
				type: 'selectabletile',
				standalone: false,
				title: 'title',
				value: 'c',
				items: [{ type: 'text', text: 'C' }]
			}
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <ASelectableTileGroup
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
		{componentObj.items.map((tile: any) => (
			renderComponents(tile)
		))}
	</ASelectableTileGroup>,
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
					[multiple]="true"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ibm-tile-group>`
			}
		},
		react: {
			imports: [],
			code: ({ json, jsonToTemplate }) => {
				return `<div role="group" aria-label="Selectable tiles"
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</div>`;
			}
		}
	}
};
