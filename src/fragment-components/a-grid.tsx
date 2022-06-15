import React from 'react';
import { Checkbox, Grid } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/grid.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const AGridSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Show outline'
			id='grid-showOutline'
			checked={selectedComponent.showOutline}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				showOutline: checked
			})} />
		<Checkbox
			labelText='Condensed'
			id='grid-condensed'
			checked={selectedComponent.condensed}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				condensed: checked
			})} />
		<Checkbox
			labelText='Full width'
			id='grid-fullWidth'
			checked={selectedComponent.fullWidth}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				fullWidth: checked
			})} />
		<Checkbox
			labelText='Narrow'
			id='grid-narrow'
			checked={selectedComponent.narrow}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				narrow: checked
			})} />
	</>;
};

// there must be a better way to do this...
const showOutlineStyle = css`
	.bx--col,
	.bx--col-sm-1, .bx--col-sm-2, .bx--col-sm-3, .bx--col-sm-4,
	.bx--col-md-1, .bx--col-md-2, .bx--col-md-3, .bx--col-md-4, .bx--col-md-5, .bx--col-md-6, .bx--col-md-7, .bx--col-md-8,
	.bx--col-lg-1, .bx--col-lg-2, .bx--col-lg-3, .bx--col-lg-4, .bx--col-lg-5, .bx--col-lg-6, .bx--col-lg-7, .bx--col-lg-8,
	.bx--col-lg-9, .bx--col-lg-10, .bx--col-lg-11, .bx--col-lg-12, .bx--col-lg-13, .bx--col-lg-14, .bx--col-lg-15, .bx--col-lg-16,
	.bx--offset-sm-1, .bx--offset-sm-2, .bx--offset-sm-3,
	.bx--offset-md-1, .bx--offset-md-2, .bx--offset-md-3, .bx--offset-md-4, .bx--offset-md-5, .bx--offset-md-6, .bx--offset-md-7,
	.bx--offset-lg-1, .bx--offset-lg-2, .bx--offset-lg-3, .bx--offset-lg-4, .bx--offset-lg-5, .bx--offset-lg-6, .bx--offset-lg-7,
	.bx--offset-lg-8, .bx--offset-lg-9, .bx--offset-lg-10, .bx--offset-lg-11, .bx--offset-lg-12, .bx--offset-lg-13, .bx--offset-lg-14,
	.bx--offset-lg-15 {
		outline: 1px dashed #78a9ff;
	}
`;

export const AGrid = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent componentObj={componentObj} rejectDrop={true} {...rest}>
			<Grid
			className={cx(
			componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
			componentObj.showOutline ? showOutlineStyle : ''
			)}
			condensed={componentObj.condensed}
			fullWidth={componentObj.fullWidth}
			narrow={componentObj.narrow}>
				{children}
			</Grid>
		</AComponent>
	);
};

const getCellAttributeString = (cell: any, sizeShort: string, sizeLong: string) => {
	const span = cell[`${sizeLong}Span`];
	const offset = cell[`${sizeLong}Offset`];

	if (!span && ! offset) {
		return '';
	}

	const spanString = `span: ${span}`;
	const offsetString = `offset: ${offset}`;

	const spanAndOffset = `{
		${span ? spanString : ''}${span && offset ? ',' : ''}
		${offset ? offsetString : ''}
	}`;

	return `${sizeShort}={${!offset ? span : spanAndOffset}}`;
};

const getCellParamsString = (cell: any) => {
	return `
		${getCellAttributeString(cell, 'sm', 'small')}
		${getCellAttributeString(cell, 'md', 'medium')}
		${getCellAttributeString(cell, 'lg', 'large')}
		${getCellAttributeString(cell, 'xlg', 'xLarge')}
		${getCellAttributeString(cell, 'max', 'max')}
	`;
};

export const componentInfo: ComponentInfo = {
	component: AGrid,
	settingsUI: AGridSettingsUI,
	keywords: ['grid', 'row', 'column'],
	name: 'Grid',
	type: 'grid',
	defaultComponentObj: {
		type: 'grid',
		showOutline: true,
		items: [
			{
				type: 'row', items: [
					{ type: 'column', items: [] },
					{ type: 'column', items: [] }
				]
			},
			{
				type: 'row', items: [
					{ type: 'column', items: [] },
					{ type: 'column', items: [] }
				]
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['GridModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<div ibmGrid ${angularClassNamesFromComponentObj(json)}>
					${json.items.map((row: any) => `<div ibmRow ${angularClassNamesFromComponentObj(row)}>
						${row.items.map((cell: any) => `<div ibmCol ${angularClassNamesFromComponentObj(cell)}>
								${jsonToTemplate(cell, fragments)}
						</div>`).join('\n')}
					</div>`).join('\n')}
				</div>`;
			}
		},
		react: {
			imports: ['Grid', 'Column', 'Row'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<Grid ${reactClassNamesFromComponentObj(json)}>
					${json.items.map((row: any) => `<Row ${reactClassNamesFromComponentObj(row)}>
						${row.items.map((cell: any) => `<Column ${getCellParamsString(cell)} ${reactClassNamesFromComponentObj(cell)}>
								${jsonToTemplate(cell, fragments)}
						</Column>`).join('\n')}
					</Row>`).join('\n')}
				</Grid>`;
			}
		}
	}
};
