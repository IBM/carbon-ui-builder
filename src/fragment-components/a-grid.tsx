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
			id='grid-outline'
			checked={selectedComponent.outline}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				outline: checked
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
const outlineStyle = css`
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
	outline,
	...rest
}: any) => {
	return (
		<AComponent componentObj={componentObj} rejectDrop={true} {...rest}>
			<Grid
			className={cx(
			componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
			(componentObj.outline || outline === true) && outline !== false ? outlineStyle : ''
			)}
			condensed={componentObj.condensed}
			fullWidth={componentObj.fullWidth}
			narrow={componentObj.narrow}>
				{children}
			</Grid>
		</AComponent>
	);
};

const getCellAttributeStringReact = (cell: any, sizeShort: string, sizeLong: string) => {
	const span = cell[`${sizeLong}Span`];
	const offset = cell[`${sizeLong}Offset`];

	if (!span && !offset) {
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

const getCellParamsStringReact = (cell: any) => {
	return `
		${getCellAttributeStringReact(cell, 'sm', 'small')}
		${getCellAttributeStringReact(cell, 'md', 'medium')}
		${getCellAttributeStringReact(cell, 'lg', 'large')}
		${getCellAttributeStringReact(cell, 'xlg', 'xLarge')}
		${getCellAttributeStringReact(cell, 'max', 'max')}
	`;
};

const getCellAttributeStringAngular = (cell: any, sizeShort: string, sizeLong: string, attributeType: string) => {
	const attribute = cell[`${sizeLong}${attributeType}`];

	if (!attribute) {
		return '';
	}

	return `'${sizeShort}': ${attribute}`;
};

const getColumnNumbersString = (cell: any) => {
	if (!(cell.smallSpan || cell.mediumSpan || cell.largeSpan || cell.xLargeSpan || cell.maxSpan)) {
		return ''; // no offset
	}

	return `[columnNumbers]="{
		${getCellAttributeStringAngular(cell, 'sm', 'small', 'Span')}
		${getCellAttributeStringAngular(cell, 'md', 'medium', 'Span')}
		${getCellAttributeStringAngular(cell, 'lg', 'large', 'Span')}
		${getCellAttributeStringAngular(cell, 'xlg', 'xLarge', 'Span')}
		${getCellAttributeStringAngular(cell, 'max', 'max', 'Span')}
	}"`;
};

const getOffsetsString = (cell: any) => {
	if (!(cell.smallOffset || cell.mediumOffset || cell.largeOffset || cell.xLargeOffset || cell.maxOffset)) {
		return ''; // no offset
	}

	return `[offsets]="{
		${getCellAttributeStringAngular(cell, 'sm', 'small', 'Offset')}
		${getCellAttributeStringAngular(cell, 'md', 'medium', 'Offset')}
		${getCellAttributeStringAngular(cell, 'lg', 'large', 'Offset')}
		${getCellAttributeStringAngular(cell, 'xlg', 'xLarge', 'Offset')}
		${getCellAttributeStringAngular(cell, 'max', 'max', 'Offset')}
	}"`;
};

export const componentInfo: ComponentInfo = {
	component: AGrid,
	settingsUI: AGridSettingsUI,
	keywords: ['grid', 'row', 'column'],
	name: 'Grid',
	type: 'grid',
	defaultComponentObj: {
		type: 'grid',
		outline: true,
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
						${row.items.map((cell: any) =>
							`<div ibmCol ${getColumnNumbersString(cell)} ${getOffsetsString(cell)} ${angularClassNamesFromComponentObj(cell)}>
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
						${row.items.map((cell: any) => `<Column ${getCellParamsStringReact(cell)} ${reactClassNamesFromComponentObj(cell)}>
								${jsonToTemplate(cell, fragments)}
						</Column>`).join('\n')}
					</Row>`).join('\n')}
				</Grid>`;
			}
		}
	}
};
