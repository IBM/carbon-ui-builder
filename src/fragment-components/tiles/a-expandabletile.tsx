import React from 'react';
import {
	Checkbox,
	ExpandableTile,
	TextInput,
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './converter';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '../';

import image from '../../assets/component-icons/tile-expandable.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const AExpandableStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TileMorphism component={selectedComponent} componentSetter={setComponent} />
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
		/>
		<Checkbox
			labelText='Expanded'
			id='expanded'
			checked={selectedComponent.expanded}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					expanded: checked
				})
			}}
		/>
		<Checkbox
			labelText='Show outline'
			id='outline'
			checked={selectedComponent.outline}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					outline: checked
				})
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const AExpandableTileCodeUI = ({ selectedComponent, setComponent }: any) => {
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

const showOutlineStyle = css`
	span.bx--tile-content__above-the-fold,
	span.bx--tile-content__below-the-fold {
		min-height: 16px;
		outline: 1px dashed #78a9ff;
	}
`;

export const AExpandableTile = ({
	children,
	componentObj,
	selected,
	...rest
}: any) => {
	return <AComponent
		componentObj={componentObj}
		selected={selected}
		className={css`display: block;`}
		{...rest}>
		<ExpandableTile
			className={componentObj.outline ? showOutlineStyle : {}}
			light={componentObj.light}
			expanded={componentObj.expanded}>
			{children}
		</ExpandableTile>
	</AComponent>;
};

export const componentInfo: ComponentInfo = {
	component: AExpandableTile,
	styleUI: AExpandableStyleUI,
	keywords: ['tile', 'fold', 'expandable'],
	name: 'Expandable Tile',
	defaultComponentObj: {
		type: 'expandabletile',
		light: false,
		expanded: true,
		outline: true,
		items: [
			{
				type: 'tilefold', aboveFold: true,
				items: [{ type: 'text', text: 'Above fold' }]
			},
			{
				type: 'tilefold', aboveFold: false,
				items: [{ type: 'text', text: 'Below fold' }]
			}
		],
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <AExpandableTile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
		{componentObj.items.map((tile: any) => (
			renderComponents(tile)
		))}
	</AExpandableTile>,
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) =>
				`@Input() ${nameStringToVariableString(json.codeContext?.name)}Expanded = "${json.expanded}"`,
			outputs: (_) =>
				``,
			imports: ['ExpandableTile'],
			code: ({ json, jsonToTemplate }) => {
				/**
				 * @todo
				 * CCA does not support theme
				 */
				return `<ibm-expandable-tile
					${json.expanded !== undefined ? `[expanded]="${nameStringToVariableString(json.codeContext?.name)}Expanded"` : ''}
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ibm-expandable-tile>`
			}
		},
		react: {
			imports: ['ExpandableTile', 'TileAboveTheFoldContent', 'TileBelowTheFoldContent'],
			code: ({ json, jsonToTemplate }) => {
				return `<ExpandableTile
					${json.light !== undefined ? `light="${json.light}"` : ''}
					${json.expanded !== undefined ? `expanded="${json.expanded}"` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ExpandableTile>`;
			}
		}
	}
};
