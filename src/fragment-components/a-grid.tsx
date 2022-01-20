import React from 'react';
import { Checkbox, Grid } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/grid.svg';

export const AGridStyleUI = ({selectedComponent, setComponent}: any) => {
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
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

const showOutlineStyle = css`
	.bx--col {
		outline: 1px dashed #78a9ff;
	}
`;

export const AGrid = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent componentObj={componentObj} {...rest}>
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

export const componentInfo: ComponentInfo = {
	component: AGrid,
	styleUI: AGridStyleUI,
	keywords: ['grid', 'row', 'column'],
	name: 'Grid',
	defaultComponentObj: {
		type: 'grid',
		items: [
			{
				type: 'row', items: [
					{ type: 'column', items: [{ type: 'text', text: 'A' }]},
					{ type: 'column', items: [{ type: 'text', text: 'B' }]}
				]
			},
			{
				type: 'row', items: [
					{ type: 'column', items: [{ type: 'text', text: 'C' }]},
					{ type: 'column', items: [{ type: 'text', text: 'D' }]}
				]
			}
		]
	},
	image
};
