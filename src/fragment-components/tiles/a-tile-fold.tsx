import React from 'react';
import {
	TileBelowTheFoldContent
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import {
	angularClassNamesFromComponentObj,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const ATileFoldSettingsUI = ({ _selectedComponent, _setComponent }: any) => {
	return '';
};

export const ATileFold = ({
	children,
	componentObj,
	onDrop,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<TileBelowTheFoldContent onDrop={onDrop}>{children}</TileBelowTheFoldContent>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATileFold,
	settingsUI: ATileFoldSettingsUI,
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline }) => <ATileFold
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
			{componentObj.items.map((item: any) => renderComponents(item, outline))}
	</ATileFold>,
	keywords: ['tile', 'tile fold', 'fold'],
	name: 'tilefold',
	hideFromElementsPane: true,
	image: undefined,
	type: 'tile-fold',
	defaultComponentObj: {
		type: 'tile-fold',
		items: []
	},
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: () => '',
			imports: [],
			code: ({ json, fragments, jsonToTemplate }) => {
				// Appends below the fold class to class list
				let classes = angularClassNamesFromComponentObj(json);
				if (classes) {
					classes = classes.split('="').join('="bx--tile-content__below-the-fold ');
				} else {
					classes = 'class="bx--tile-content__below-the-fold"';
				}

				return `<span ${classes}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</span>`;
			}
		},
		react: {
			imports: [],
			code: ({ json, jsonToTemplate, fragments }) => {
				return `<TileBelowTheFoldContent
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
					</TileBelowTheFoldContent>`;
			}
		}
	}
};
