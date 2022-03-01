import React from 'react';
import {
	TileAboveTheFoldContent,
	TileBelowTheFoldContent,
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import {
	angularClassNamesFromComponentObj,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const ATileFoldStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
};

export const ATileFold = ({
	children,
	componentObj,
	onDrop,
	selected,
	...rest
}: any) => {
	return <>
		<AComponent
			componentObj={componentObj}
			{...rest}>
			{componentObj.aboveFold ?
				<TileAboveTheFoldContent onDrop={onDrop}>{children}</TileAboveTheFoldContent> :
				<TileBelowTheFoldContent onDrop={onDrop}>{children}</TileBelowTheFoldContent>
			}
		</AComponent>
	</>;
};

export const componentInfo: ComponentInfo = {
	component: ATileFold,
	styleUI: ATileFoldStyleUI,
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) =>
		<ATileFold
			componentObj={componentObj}
			select={select}
			remove={remove}
			selected={selected}
			onDragOver={onDragOver}
			onDrop={onDrop}>
			{componentObj.items.map((element: any) => (
				renderComponents(element)
			))}
		</ATileFold>,
	keywords: ['tile', 'tile fold', 'fold'],
	name: 'tilefold',
	hideFromElementsPane: true,
	image: undefined,
	defaultComponentObj: {
		type: 'tilefold',
		aboveFold: true,
		items: [{ type: 'text', text: 'A' }]
	},
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: [],
			code: ({ json, jsonToTemplate }) => {
				const foldClass = json.aboveFold ? `bx--tile-content__above-the-fold` : `bx--tile-content__below-the-fold`;
				let classes = angularClassNamesFromComponentObj(json);
				if (classes) {
					classes = classes.replace('="', `="${foldClass} `);
				} else {
					classes = `class="${foldClass}"`;
				}

				return `<span ${classes}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</span>`;
			}
		},
		react: {
			imports: [],
			code: ({ json, jsonToTemplate }) => {
				const foldComponent = json.aboveFold ? 'TileAboveTheFoldContent' : 'TileBelowTheFoldContent';

				return `<${foldComponent}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
					</${foldComponent}>`
			}
		}
	}
};
