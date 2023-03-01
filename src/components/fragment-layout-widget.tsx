import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'carbon-components-react';
import {
	Draggable16,
	Edit16,
	TrashCan16,
	ChevronDown16,
	ChevronUp16
} from '@carbon/icons-react';
import { css, cx } from 'emotion';
import { actionIconStyle } from '../routes';
import { getParentComponent, stateWithoutComponent, updatedState } from './fragment';

const widgetItemStyle = css`
	display: flex;
	line-height: 2rem;
	height: 2rem;

	&:not(:last-child) {
		border-bottom: 1px solid #e0e0e0;
	}

	button {
		height: 2rem;
	}
`;

const buttonStyle = css`
	width: 2rem;
	padding: 2px 7px;
	min-height: 2rem;
`;

const dragHandlerStyle = css`
	padding: 3px 0px 0px 6px;
	cursor: grab;

	&:active {
		cursor: grabbing;
	}
`;

const droppableAreaStyle = css`
	width: 100%;
	position: relative;
	transition: margin-top 100ms, margin-bottom 100ms, height 100ms;
	display: none;

	&.drag-in-progress {
		display: block;
		margin-top: -2px;
		margin-bottom: -14px;
		height: 16px;
		z-index: 999999999;
	}

	&.drag-in-progress-center {
		margin-top: 4px;
		margin-bottom: -28px;
		height: 24px;
	}

	&.drag-over {
		border: 1px solid #0f62fe;
		margin-top: 0;
		margin-bottom: 0;
		height: 32px;
	}

	&.drag-over-center {
		border: 1px solid #0f62fe;
		margin-top: 4px;
		margin-bottom: -28px;
		height: 24px;
	}
`;

const LayoutWidgetItem = ({
	componentObj,
	depth = 0,
	showDropTargetAfter = false,
	index,
	isDragging,
	setIsDragging,
	isExpanded,
	setExpanded,
	fragment,
	setFragment
}: any) => {
	const draggedItemRef = useRef(null);
	const expansionTimerRef = useRef(null as any);
	const [isDragOver, setIsDragOver] = useState({
		before: false,
		center: false,
		after: false
	});

	const expandOnLongHover = () => {
		if (expansionTimerRef.current !== null) {
			// already waiting, don't start second timer
			return;
		}

		expansionTimerRef.current = setTimeout(() => {
			if (componentObj.items) {
				setExpanded(componentObj, true);
			}
		}, 900);
	};

	const cancelExpansion = () => {
		clearTimeout(expansionTimerRef.current);
		expansionTimerRef.current = null;
	};

	const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		setIsDragging(true);

		event.dataTransfer.setDragImage(draggedItemRef.current || document.body, 0, 0);
		event.dataTransfer.setData('drag-object', JSON.stringify({
			component: componentObj,
			type: 'move'
		}));
	};

	const onDragEnd = (_: any) => {
		setIsDragging(false);
		setIsDragOver({
			before: false,
			center: false,
			after: false
		});
	};

	const onDragOver = (event: any) => {
		event.preventDefault();
		setIsDragOver({
			before: true,
			center: false,
			after: false
		});
	};

	const onDragOverCenter = (event: any) => {
		event.preventDefault();
		expandOnLongHover();

		setIsDragOver({
			before: false,
			center: true,
			after: false
		});
	};

	const onDragOverAfter = (event: any) => {
		event.preventDefault();
		setIsDragOver({
			before: false,
			center: false,
			after: true
		});
	};

	const onDragLeave = (_event: any) => {
		setIsDragOver({
			before: false,
			center: false,
			after: false
		});
		cancelExpansion();
	};

	const dropHelper = (event: any) => {
		event.preventDefault();
		setIsDragOver({
			before: false,
			center: false,
			after: false
		});
		setIsDragging(false);

		// parse only if data exists
		const data = event.dataTransfer.getData('drag-object');
		if (!data) {
			return false;
		}
		const dragObj = JSON.parse(data);

		return dragObj;
	};

	const onDropBefore = (event: any) => {
		const dragObj = dropHelper(event);

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				dragObj,
				getParentComponent(fragment.data, componentObj).id,
				index
			)
		});
	};

	const onDropIn = (event: any) => {
		const dragObj = dropHelper(event);

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				dragObj,
				componentObj.id
			)
		});
	};

	const onDropAfter = (event: any) => {
		const dragObj = dropHelper(event);

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				dragObj,
				getParentComponent(fragment.data, componentObj).id,
				index + 1
			)
		});
	};

	return <>
		<div
			className={cx(droppableAreaStyle, isDragging ? 'drag-in-progress' : '', isDragOver.before ? 'drag-over' : '')}
			onDragOver={onDragOver}
			onDrop={onDropBefore}
			onDragLeave={onDragLeave} />
		<div
			className={cx(
				droppableAreaStyle,
				isDragging ? 'drag-in-progress drag-in-progress-center' : '',
				isDragOver.center ? 'drag-over-center' : ''
			)}
			onDragOver={onDragOverCenter}
			onDrop={onDropIn}
			onDragLeave={onDragLeave} />
		<div className={widgetItemStyle} ref={draggedItemRef}>
			<div
			draggable
			className={dragHandlerStyle}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}>
				<Draggable16 />
			</div>

			<div className={css`width: ${depth}rem;`} />
			{
				componentObj.items && componentObj.items.length
				? <Button
					kind='ghost'
					aria-label='Toggle expanded'
					title='Toggle expanded'
					className={buttonStyle}
					onClick={() => setExpanded(componentObj, !isExpanded(componentObj))}>
							{
								isExpanded(componentObj)
								? <ChevronUp16 className={actionIconStyle} />
								: <ChevronDown16 className={actionIconStyle} />
							}
					</Button>
				: <div className={css`min-width: 32px;`} />
			}

			<span className={css`width: 100%;`}>{componentObj.type}</span>

			<Button
				kind='ghost'
				aria-label='Edit'
				title='Edit'
				className={buttonStyle}
				onClick={() => setFragment({
					...fragment,
					selectedComponentId: componentObj.id
				}, false)}>
				<Edit16 className={actionIconStyle} />
			</Button>
			<Button
				kind='ghost'
				aria-label='Delete'
				title='Delete'
				className={buttonStyle}
				onClick={() => setFragment({
					...fragment,
					// for whatever reason it's reporting this problem here for .data
					// eslint-disable-next-line react/prop-types
					data: stateWithoutComponent(fragment.data, componentObj.id)
				})}>
				<TrashCan16 className={actionIconStyle} />
			</Button>
		</div>
		{
			isExpanded(componentObj)
			&& componentObj.items?.map((component: any, index: number) =>
				<LayoutWidgetItem
					key={component.id}
					componentObj={component}
					depth={depth + 1}
					index={index}
					isDragging={isDragging}
					setIsDragging={setIsDragging}
					isExpanded={isExpanded}
					setExpanded={setExpanded}
					fragment={fragment}
					setFragment={setFragment} />
			)
		}
		{
			showDropTargetAfter
			&& <div
				className={cx(droppableAreaStyle, isDragging ? 'drag-in-progress' : '', isDragOver.after ? 'drag-over' : '')}
				onDragOver={onDragOverAfter}
				onDrop={onDropAfter}
				onDragLeave={onDragLeave} />
		}
	</>;
};

export const FragmentLayoutWidget = ({ fragment, setFragment, className }: any) => {
	const [expansion, setExpansion] = useState({} as any);
	const [isDragging, setIsDragging_] = useState(false);

	useEffect(() => {
		setExpansion({});
	}, [fragment.id]);

	const setExpanded = (component: any, expanded: boolean) => {
		setExpansion({
			...expansion,
			[component.id]: expanded
		});
	};

	// delay to grab a picture of dragging element before visual guides turn on
	const setIsDragging = (is: boolean) => setTimeout(() => setIsDragging_(is));

	const isExpanded = (component: any) => !!expansion[component.id];

	return <div
	onDragOver={() => setIsDragging(true)}
	onDragLeave={() => setIsDragging(false)}
	className={className}>
		{
			fragment.data.items?.map((component: any, index: number, { length }: {length: number}) =>
				<LayoutWidgetItem
					key={component.id}
					componentObj={component}
					index={index}
					isDragging={isDragging}
					setIsDragging={setIsDragging}
					isExpanded={isExpanded}
					setExpanded={setExpanded}
					fragment={fragment}
					setFragment={setFragment}
					showDropTargetAfter={index + 1 === length} />)
		}
	</div>;
};
