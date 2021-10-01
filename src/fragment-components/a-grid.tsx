import React from 'react';
import { Checkbox, Grid } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';

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
			className={componentObj.showOutline ? showOutlineStyle : ''}
			condensed={componentObj.condensed}
			fullWidth={componentObj.fullWidth}
			narrow={componentObj.narrow}>
				{children}
			</Grid>
		</AComponent>
	);
};
