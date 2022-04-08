import React from 'react';
import {
	Row,
	Checkbox
} from 'carbon-components-react';
import { Add32 } from '@carbon/icons-react';
import { AComponent } from './a-component';
import { getParentComponent, updatedState } from '../components';
import { css, cx } from 'emotion';
import { useFragment } from '../context';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

export const ARowStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Condensed'
			id='grid-condensed'
			checked={selectedComponent.condensed}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				condensed: checked
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
	</>;
};

const addStyle = css`
	position: absolute;
	margin-left: calc(50% - 10px);
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
`;

const addStyleTop = cx(addStyle, css`
	top: -20px;
`);

const addStyleBottom = cx(addStyle, css`
	bottom: -20px;
	z-index: 1;
`);

const iconStyle = css`
	height: 1rem;
	width: 1rem;
	float: right;
	cursor: pointer`;

export const ARow = ({
	children,
	componentObj,
	selected,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();

	const parentComponent = getParentComponent(fragment.data, componentObj);

	/**
	 * @param offset 0 - add left, 1 - add right
	 */
	const addRow = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'row', items: [
						{ type: 'column', items: [{ type: 'text', text: 'Cell 1' }] },
						{ type: 'column', items: [{ type: 'text', text: 'Cell 2' }] }
					]
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	return (
		// position: relative doesn't seem to affect the grid layout and it's needed atm
		// to position right add icon
		<AComponent componentObj={componentObj} selected={selected} {...rest}>
			<Row
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				css`position: relative`
			)}
			condensed={componentObj.condensed}
			narrow={componentObj.narrow}>
				<span className={cx(addStyleTop, selected ? css`` : css`display: none`)}>
					<Add32 onClick={(event: any) => {
						event.stopPropagation();
						addRow();
					}} className={iconStyle}/>
				</span>
				<span className={cx(addStyleBottom, selected ? css`` : css`display: none`)}>
					<Add32 onClick={(event: any) => {
						event.stopPropagation();
						addRow(1);
					}} className={iconStyle}/>
				</span>
				{children}
			</Row>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARow,
	styleUI: ARowStyleUI,
	keywords: ['grid', 'row'],
	name: 'Row',
	hideFromElementsPane: true,
	defaultComponentObj: undefined,
	image: undefined,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['GridModule'],
			isNotDirectExport: true,
			code: (_) => ''
		},
		react: {
			imports: ['Row'],
			isNotDirectExport: true,
			code: (_) => ''
		}
	}
};
