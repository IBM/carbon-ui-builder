import React, { useRef } from 'react';
import {
	Row,
	Checkbox
} from 'carbon-components-react';
import { Add32 } from '@carbon/icons-react';
import { AComponent } from './a-component';
import { getParentComponent, updatedState } from '../components';
import { css, cx } from 'emotion';
import { useFragment } from '../context';
import { ComponentInfo } from '.';
import { getDropIndex } from '../routes/edit/tools';

export const ARowSettingsUI = ({ selectedComponent, setComponent }: any) => {
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

const addStyleLeftRight = css`
	position: absolute;
	margin-top: 14px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
	z-index: 1;
`;

const addStyleLeft = cx(addStyleLeftRight, css`
	margin-left: -20px;
`);

const addStyleRight = cx(addStyleLeftRight, css`
	margin-left: 100%;
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
	const holderRef = useRef(null as any);

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
						{ type: 'column', items: [] },
						{ type: 'column', items: [] }
					]
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	/**
	 * @param offset 0 - add left, 1 - add right
	 */
	const addCell = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'column',
					items: []
				}
			},
			componentObj.id,
			offset
		)
	});

	return (
		// position: relative doesn't seem to affect the grid layout and it's needed atm
		// to position right add icon
		<AComponent
		componentObj={componentObj}
		selected={selected}
		handleDrop={(event: any) => {
			const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));

			const dropIndex = getDropIndex(event, holderRef.current);
			// if type is column, drop in place in row,
			// if it's anything else, drop in closest column
			if (dragObj.component.type === 'column') {
				setFragment({
					...fragment,
					data: updatedState(
						fragment.data,
						dragObj,
						componentObj.id,
						dropIndex
					)
				});
			} else {
				setFragment({
					...fragment,
					data: updatedState(
						fragment.data,
						dragObj,
						componentObj.items[dropIndex].id,
						0
					)
				});
			}
		}}
		{...rest}>
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
				<span className={cx(addStyleLeft, selected ? css`` : css`display: none`)}>
					<Add32 onClick={(event: any) => {
						event.stopPropagation();
						addCell();
					}} className={iconStyle}/>
				</span>
				<span className={cx(addStyleRight, selected ? css`` : css`display: none`)}>
					<Add32 onClick={(event: any) => {
						event.stopPropagation();
						addCell(componentObj.items.length);
					}} className={iconStyle}/>
				</span>
				<span className={cx(addStyleBottom, selected ? css`` : css`display: none`)}>
					<Add32 onClick={(event: any) => {
						event.stopPropagation();
						addRow(1);
					}} className={iconStyle}/>
				</span>
				<section ref={holderRef} className={css`display: contents`}>
					{children}
				</section>
			</Row>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARow,
	settingsUI: ARowSettingsUI,
	keywords: ['grid', 'row'],
	name: 'Row',
	hideFromElementsPane: true,
	defaultComponentObj: undefined,
	type: 'row',
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
