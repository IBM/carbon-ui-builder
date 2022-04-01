import React from 'react';
import {
	Checkbox,
	ExpandableTile,
	TileAboveTheFoldContent,
	TextInput
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '..';
import image from '../../assets/component-icons/tile-expandable.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const AExpandableStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TileMorphism component={selectedComponent} setComponent={setComponent} />
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					light: checked
				});
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
				});
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
				});
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
	onDrop,
	selected,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		selected={selected}
		headingCss={css`display: block;`}
		{...rest}>
			<ExpandableTile
			light={componentObj.light}
			className={`${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} ${componentObj.outline ? showOutlineStyle : ''}`}
			expanded={componentObj.expanded}>
				<TileAboveTheFoldContent onDrop={onDrop}>
					{children.filter(({props}: any) => (props !== undefined ? (props.componentObj.type !== 'tilefold') : false))}
				</TileAboveTheFoldContent>
				{
					// Renders bottom fold component
					children.filter(({props}: any) => (props !== undefined ? (props.componentObj.type === 'tilefold') : false))
				}
			</ExpandableTile>
		</AComponent>
	);
};

// Splits data into folds - all exports will have a common approach
const getFoldObjects = (json: any) => {
	return [
		json.items.filter((item: any) => item.type !== 'tilefold'),
		json.items.filter((item: any) => item.type === 'tilefold')
	];
}

export const componentInfo: ComponentInfo = {
	component: AExpandableTile,
	styleUI: AExpandableStyleUI,
	keywords: ['tile', 'fold', 'expandable'],
	name: 'Expandable tile',
	defaultComponentObj: {
		type: 'expandabletile',
		light: false,
		expanded: true,
		outline: false,
		items: [
			{
				type: 'text',
				text: 'Above fold',
			},
			{
				type: 'tilefold',
				items: [
					{
						type: 'text',
						text: 'Below fold'
					}
				]
			}
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <AExpandableTile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
			{componentObj.items.map((fold: any) => renderComponents(fold))}
	</AExpandableTile>,
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) =>
				`@Input() ${nameStringToVariableString(json.codeContext?.name)}Expanded = ${json.expanded}`,
			outputs: () => '',
			imports: ['TilesModule'],
			code: ({ json, jsonToTemplate }) => {
				const folds = getFoldObjects(json);
				/**
				 * @todo - CCA does not support light
				 * https://github.com/IBM/carbon-components-angular/issues/1999
				 */
				return `<ibm-expandable-tile
					${json.expanded !== undefined ? `[expanded]="${nameStringToVariableString(json.codeContext?.name)}Expanded"` : ''}
					${angularClassNamesFromComponentObj(json)}>
						<span class="bx--tile-content__above-the-fold">
							${folds[0].map((element: any) => jsonToTemplate(element)).join('\n')}
						</span>
						${folds[1].map((element: any) => jsonToTemplate(element)).join('\n')}
				</ibm-expandable-tile>`
			}
		},
		react: {
			imports: ['ExpandableTile', 'TileAboveTheFoldContent', 'TileBelowTheFoldContent'],
			code: ({ json, jsonToTemplate, fragments }) => {
				const folds = getFoldObjects(json);
				return `<ExpandableTile
					${json.light !== undefined && !!json.light ? `light={${json.light}}` : ''}
					${json.expanded !== undefined && !!json.expanded ? `expanded={${json.expanded}}` : ''}
					${reactClassNamesFromComponentObj(json)}>
						<TileAboveTheFoldContent>
							${folds[0].map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
						</TileAboveTheFoldContent>
						${folds[1].map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ExpandableTile>`;
			}
		}
	}
};
