import React from 'react';
import {
	TileBelowTheFoldContent
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
			<TileBelowTheFoldContent onDrop={onDrop}>{children}</TileBelowTheFoldContent>
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
			{componentObj.items.map((item: any) => renderComponents(item))}
		</ATileFold>,
	keywords: ['tile', 'tile fold', 'fold'],
	name: 'tilefold',
	hideFromElementsPane: true,
	image: undefined,
	defaultComponentObj: {
		type: 'tilefold',
		items: []
	},
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: () => '',
			imports: [],
			code: ({ json, jsonToTemplate }) => {
				// Appends below the fold class to class list
				let classes = angularClassNamesFromComponentObj(json);
				if (classes) {
					classes = classes.split('="').join(`="bx--tile-content__below-the-fold `);
				} else {
					classes = `class="bx--tile-content__below-the-fold"`;
				}

				return `<span ${classes}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
				</span>`;
			}
		},
		react: {
			imports: [],
			code: ({ json, jsonToTemplate }) => {
				return `<TileBelowTheFoldContent
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
					</TileBelowTheFoldContent>`;
			}
		}
	}
};
