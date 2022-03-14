import { css, cx } from 'emotion';
import React, { useRef, useState } from 'react';

import { Draggable32, TrashCan32 } from '@carbon/icons-react';
import { drag } from '../routes/edit/tools';
import { useFragment } from '../context';
import { getParentComponent, updatedState } from '../components';

const headerStyle = css`
	position: absolute;
	margin-top: -26px;
	padding-left: 6px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
`;

const iconStyle = css`height: 1rem; width: 1rem; float: right`;

export const AComponentCodeUI = ({selectedComponent, setComponent}: any) => {
	return <span className={css`overflow-wrap: anywhere`}>
		{JSON.stringify(selectedComponent)}
	</span>
};

const dropBorderStyle = '2px solid #0f62fe';

const dropStyle = css`
	position: absolute;
	width: 15px;
	height: 15px;
	line-height: 21px;
	z-index: 2;
`;

const dropStyleBefore = cx(dropStyle, css`
	margin-left: -4px;
	margin-top: -4px;
	border-left: ${dropBorderStyle};
	border-top: ${dropBorderStyle};
`);

const dropStyleAfter = cx(dropStyle, css`
	margin-left: calc(100% - 11px);
	border-right: ${dropBorderStyle};
	border-bottom: ${dropBorderStyle};
	bottom: -4px;
`);

export interface ComponentInfo {
	component: any,
	keywords: string[],
	name: string,
	defaultComponentObj: any,
	image: any, // whatever fits in the <img src="here">
	styleUI: any,
	codeUI?: any,
	render?: (props: ComponentInfoRenderProps) => any,
	hideFromElementsPane?: boolean,
	codeExport: {
		angular: {
			inputs: (props: {json: any}) => string,
			outputs: (props: {json: any}) => string,
			imports: string[],
			isNotDirectExport?: boolean,
			code: (props: {json: any, jsonToTemplate: (json: any) => string}) => string
		},
		react: {
			imports: string[],
			otherImports?: (props: {json: any, fragments?: any[]}) => string,
			isNotDirectExport?: boolean,
			code: (props: {json: any, jsonToTemplate: (json: any, fragments?: any[]) => string, fragments?: any[]}) => string
		}
	}
}

export interface ComponentInfoRenderProps {
	componentObj: any,
	select: () => void,
	remove: () => void,
	selected: boolean,
	onDragOver: (event: any) => void,
	onDrop: (event: any) => any,
	renderComponents: (componentObj: any) => any
}

export const AComponent = ({
	children,
	componentObj,
	select,
	selected,
	remove,
	headingCss,
	className
}: any) => {
	// TODO use fragments context instead of passing in `remove`?
	const [fragment, setFragment] = useFragment();
	const [showDragOverIndicator, setShowDragOverIndicator] = useState(false);
	const [dragOverPosition, setDragOverPosition] = useState([] as any[]);
	const holderRef = useRef(null as any);

	const isDragOverLeft = () => dragOverPosition[0] < holderRef.current.offsetWidth  / 2;
	// const isDragOverRight = () => !isDragOverLeft();
	const isDragOverTop = () => dragOverPosition[1] < holderRef.current.offsetHeight  / 2;
	// const isDragOverBottom = () => !isDragOverTop();
	const isDragOverBefore = () => isDragOverLeft() || isDragOverTop();
	const isDragOverAfter = () => !isDragOverBefore();

	const onDrop = (event: any) => {
		event.stopPropagation();
		event.preventDefault();
		setShowDragOverIndicator(false)

		const dragObj = JSON.parse(event.dataTransfer.getData("drag-object"));

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				dragObj,
				componentObj.id,
				getParentComponent(fragment.data, componentObj).items.indexOf(componentObj) + (isDragOverBefore() ? 0 : 1)
			)
		});
	};

	return (
		<span
		className={className}
		ref={holderRef}
		onClick={(event) => {
			event.stopPropagation();
			select();
		}}
		draggable='true' // TODO make Draggable32 the drag handle and this element as preview
		onDragStart={(event: any) => drag(event, {
			component: componentObj,
			type: 'move'
		})}
		onDragEnter={(event: any) => {
			event.stopPropagation();
			setShowDragOverIndicator(true);
		}}
		onDragLeave={(event: any) => {
			event.stopPropagation();
			setShowDragOverIndicator(false);
		}}
		onDragOver={(event) => {
			const rect = event.currentTarget.getBoundingClientRect();
			setDragOverPosition([event.pageX - rect.left, event.pageY - rect.top]);
		}}
		onDrop={onDrop}>
			<span className={cx(
				dropStyleBefore,
				showDragOverIndicator && isDragOverBefore() ? css`` : css`display: none`
			)} />
			<span className={cx(
				dropStyleAfter,
				showDragOverIndicator && isDragOverAfter() ? css`` : css`display: none`
			)} />
			<span className={cx(headerStyle, headingCss, selected ? css`` : css`display: none`)}>
				<span className={css`margin-right: 1rem`}>
					{componentObj && componentObj.type ? componentObj.type : 'Header'}
				</span>
				<Draggable32 className={iconStyle}/>
				<TrashCan32 onClick={(event: any) => {
					event.stopPropagation();
					if (remove) {
						remove();
					}
				}} className={iconStyle}/>
			</span>
			{children}
		</span>
	);
};
