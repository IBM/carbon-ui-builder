import React from 'react';
import {
	TextInput,
	Checkbox,
	ClickableTile,
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './converter';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '../';

import image from '../../assets/component-icons/tile-clickable.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const AClickableTileStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TileMorphism component={selectedComponent} componentSetter={setComponent} />
		<TextInput
			id='href-input'
			value={selectedComponent.href}
			labelText='href for clickable UI'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					href: event.currentTarget.value
				});
			}}
		/>

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

export const AClickableTileCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const AClickableTile = ({
	children,
	componentObj,
	onDrop,
	selected,
	renderComponents,
	...rest
}: any) => {

	return <AComponent
		componentObj={componentObj}
		className={css`display: block;`}
		selected={selected}
		{...rest}>
		<ClickableTile
			onDrop={onDrop}
			light={componentObj.light}
			href={componentObj.href}
			disabled={componentObj.disabled}>
			{children}
		</ClickableTile>
	</AComponent>;
};



export const componentInfo: ComponentInfo = {
	component: AClickableTile,
	styleUI: AClickableTileStyleUI,
	codeUI: AClickableTileCodeUI,
	keywords: ['tile', 'clickable', 'card'],
	name: 'Clickable Tile',
	defaultComponentObj: {
		type: 'clickabletile',
		/**
		 * @todo
		 * CCA does not support theme
		 */
		light: false,
		items: []
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <AClickableTile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
		{componentObj.items.map((tile: any) => (
			renderComponents(tile)
		))}
	</AClickableTile>,
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}href = '${json.helperText}';
				@Input() ${nameStringToVariableString(json.codeContext?.name)}disabled = ${json.disabled}`,
			outputs: (_) => ``,
			imports: ['ClickableTile'],
			code: ({ json, jsonToTemplate }) => {
				return `<ibm-clickable-tile
					[href]=${nameStringToVariableString(json.codeContext?.name)}href
					[disabled]={${nameStringToVariableString(json.codeContext?.name)}disabled}
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ibm-clickable-tile>`;
			}
		},
		react: {
			imports: ['ClickableTile'],
			code: ({ json, jsonToTemplate }) => {
				return `<ClickableTile
					${json.href !== undefined ? `href="${json.href}"` : ''}
					${json.light !== undefined ? `light="${json.light}"` : ''}
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</ClickableTile>`;
			}
		}
	}
};
