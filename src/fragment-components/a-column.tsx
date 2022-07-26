import React, { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	Column,
	NumberInput
} from 'carbon-components-react';
import { Add32, Help32 } from '@carbon/icons-react';
import { css, cx } from 'emotion';
import { AComponent } from './a-component';
import { useFragment } from '../context';
import { getParentComponent, updatedState } from '../components';
import { ComponentInfo } from '.';
import { APlaceholder } from './a-placeholder';

const helpIconStyle = css`
	color: #525252;
	position: absolute;
	right: 1rem;
	z-index: 1;
	background: white;

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

export const AColumnSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const onNumInputchange = (event: any) => {
		setComponent({
			...selectedComponent,
			[event.imaginaryTarget.name]: Number(event.imaginaryTarget.value)
		});
	};

	const [isAccordionOpen, setIsAccordionOpen] = useState({} as any);

	useEffect(() => {
		setIsAccordionOpen({
			small: selectedComponent.smallSpan || selectedComponent.smallOffset,
			medium: selectedComponent.mediumSpan || selectedComponent.mediumOffset,
			large: selectedComponent.largeSpan || selectedComponent.largeOffset,
			xLarge: selectedComponent.xLargeSpan || selectedComponent.xLargeOffset,
			max: selectedComponent.maxSpan || selectedComponent.maxOffset
		});
	}, [selectedComponent]);

	return <>
		<a
		href='https://www.carbondesignsystem.com/guidelines/2x-grid/implementation/'
		target='_blank'
		rel='noopener noreferrer'
		className={helpIconStyle}>
			<Help32 />
		</a>
		<Accordion align='start'>
			<AccordionItem title='Small' open={isAccordionOpen.small}>
				<NumberInput
					min={0}
					max={4}
					label='Span'
					name='smallSpan'
					value={selectedComponent.smallSpan}
					onChange={onNumInputchange} />
				<NumberInput
					min={0}
					max={3}
					label='Offset'
					name='smallOffset'
					value={selectedComponent.smallOffset}
					onChange={onNumInputchange} />
			</AccordionItem>

			<AccordionItem title='Medium' open={isAccordionOpen.medium}>
				<NumberInput
					min={0}
					max={8}
					label='Span'
					name='mediumSpan'
					value={selectedComponent.mediumSpan}
					onChange={onNumInputchange} />
				<NumberInput
					min={0}
					max={7}
					label='Offset'
					name='mediumOffset'
					value={selectedComponent.mediumOffset}
					onChange={onNumInputchange} />
			</AccordionItem>

			<AccordionItem title='Large' open={isAccordionOpen.large}>
				<NumberInput
					min={0}
					max={16}
					label='Span'
					name='largeSpan'
					value={selectedComponent.largeSpan}
					onChange={onNumInputchange} />
				<NumberInput
					min={0}
					max={15}
					label='Offset'
					name='largeOffset'
					value={selectedComponent.largeOffset}
					onChange={onNumInputchange} />
			</AccordionItem>

			<AccordionItem title='Extra large' open={isAccordionOpen.xLarge}>
				<NumberInput
					min={0}
					max={16}
					label='Span'
					name='xLargeSpan'
					value={selectedComponent.xLargeSpan}
					onChange={onNumInputchange} />
				<NumberInput
					min={0}
					max={15}
					label='Offset'
					name='xLargeOffset'
					value={selectedComponent.xLargeOffset}
					onChange={onNumInputchange} />
			</AccordionItem>

			<AccordionItem title='Max' open={isAccordionOpen.max}>
				<NumberInput
					min={0}
					max={16}
					label='Span'
					name='maxSpan'
					value={selectedComponent.maxSpan}
					onChange={onNumInputchange} />
				<NumberInput
					min={0}
					max={15}
					label='Offset'
					name='maxOffset'
					value={selectedComponent.maxOffset}
					onChange={onNumInputchange} />
			</AccordionItem>
		</Accordion>
	</>;
};

const addStyleLeftRight = css`
	position: absolute;
	margin-top: 14px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
	z-index: 1;
`;

const addStyleLeft = cx(addStyleLeftRight, css`
	margin-left: -30px;
`);

const addStyleRight = cx(addStyleLeftRight, css`
	margin-left: calc(100% - 30px);
`);

const addStyleTopBottom = css`
	position: absolute;
	margin-left: calc(50% - 10px);
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
`;

const addStyleTop = cx(addStyleTopBottom, css`
	top: -20px;
`);

const addStyleBottom = cx(addStyleTopBottom, css`
	bottom: -20px;
	z-index: 1;
`);

const iconStyle = css`
	height: 1rem;
	width: 1rem;
	float: right;
	cursor: pointer`;

export const AColumn = ({
	children,
	componentObj,
	onDrop,
	selected,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();

	const parentComponent = getParentComponent(fragment.data, componentObj);

	const grandParentComponent = getParentComponent(fragment.data, parentComponent);

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
			grandParentComponent.id,
			grandParentComponent.items.indexOf(parentComponent) + offset
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
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	return (
		// position: relative doesn't seem to affect the grid layout and it's needed atm
		// to position right add icon
		<Column
		onDrop={onDrop}
		className={cx(componentObj.cssClasses?.map((cc: any) => cc.id).join(' '), css`position: relative`)}
		sm={{
			span: componentObj.smallSpan || undefined,
			offset: componentObj.smallOffset || undefined
		}}
		md={{
			span: componentObj.mediumSpan || undefined,
			offset: componentObj.mediumOffset || undefined
		}}
		lg={{
			span: componentObj.largeSpan || undefined,
			offset: componentObj.largeOffset || undefined
		}}
		xlg={{
			span: componentObj.xLargeSpan || undefined,
			offset: componentObj.xLargeOffset || undefined
		}}
		max={{
			span: componentObj.maxSpan || undefined,
			offset: componentObj.maxOffset || undefined
		}}>
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
					addCell(1);
				}} className={iconStyle}/>
			</span>
			<span className={cx(addStyleBottom, selected ? css`` : css`display: none`)}>
				<Add32 onClick={(event: any) => {
					event.stopPropagation();
					addRow(1);
				}} className={iconStyle}/>
			</span>
			<AComponent
			componentObj={componentObj}
			className={css`display: block; height: 100%;`}
			selected={selected}
			rejectDrop={(dragObj: any) => {
				// don't allow dropping columns directly into other columns
				// row drop handler will take over
				if (dragObj.component.type === 'column') {
					return true;
				}

				return false;
			}}
			{...rest}>
				{
					children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
				}
			</AComponent>
		</Column>
	);
};

export const componentInfo: ComponentInfo = {
	component: AColumn,
	settingsUI: AColumnSettingsUI,
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline }) => <AColumn
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
			{componentObj.items.map((column: any) => (
				renderComponents(column, outline)
			))}
	</AColumn>,
	keywords: ['column', 'grid'],
	name: 'Column',
	type: 'column',
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
			imports: ['Column'],
			isNotDirectExport: true,
			code: (_) => ''
		}
	}
};
