import React, { useState,useRef } from 'react';
import { Button, Tile } from 'carbon-components-react';
import { css, cx } from 'emotion';
import {
	AddAlt32,
	Draggable16,
	TrashCan32
} from '@carbon/icons-react';

const addDragTargetStyle = css`
	height: var(--drag-target-height, 32px);
	width: 100%;
	display: flex;
	justify-content: center;
	outline-offset: -2px;
	transition: height 0.15s ease-in-out;
`;

const addButtonDraggingStyle = css`
	outline: var(--outline, 1px dashed #1666fe);
`;

const addButtonStyle = css`
	width: 100%;
	display: flex;
	justify-content: center;
`;

const trashButtonStyle = css`
	margin-left: 12px;
	top: 0;
	right: 0;
	border-color: transparent;

	&.bx--btn.bx--btn--icon-only.bx--tooltip__trigger {
		position: absolute;
	}
`;

const draggableIconStyle = css`
	position: absolute;
	top: 50%;
	left: 0;
`;

const tileStyle = css`
	position: relative;
`;

export const DraggableTileList = ({
	template, // Functional component
	dataList,
	setDataList,
	defaultObject // Default object created
}: any) => {
	const [dragging, setDragging] = useState(false);
	const draggedItem = useRef<HTMLDivElement>();

	const onDragStart = (event: any, index: number) => {
		setDragging(true);
		event.dataTransfer.setData('index', index);
		draggedItem.current = event.currentTarget;
	};

	const onDragEnd = (_: any) => {
		setDragging(false);
	};

	const onDragOver = (event: any) => {
		event.preventDefault();
		event.currentTarget.style.setProperty('--drag-target-height', `${(draggedItem.current?.clientHeight || 0)}px`);
		event.currentTarget.style.setProperty('--outline', '2px dashed #0f62fe');
	};

	const onDragLeave = (event: any) => {
		event.currentTarget.style.setProperty('--drag-target-height', '');
		event.currentTarget.style.setProperty('--outline', '');
	};

	const onDrop = (event: any, index: number) => {
		const previousIndex = event.dataTransfer.getData('index');
		const item = { ...dataList[previousIndex] };
		const newList = [...dataList];
		// Splice makes it easier to remove & add to new position
		newList.splice(previousIndex, 1);
		newList.splice(index, 0, item);
		setDataList(newList);
	};

	const addToList = (event: any, index: number) => {
		event.stopPropagation();
		setDataList([
			...dataList.slice(0, index),
			{ ...defaultObject },
			...dataList.slice(index)
		]);
	};

	const removeFromList = (event: any, index: number) => {
		event.stopPropagation();
		setDataList([
			...dataList.slice(0, index),
			...dataList.slice(index + 1)
		]);
	};

	const AddButton = ({ index }: any) => {
		return (
			<div
			onDrop={(event: any) => onDrop(event, index)}
			onDragOver={(event: any) => onDragOver(event)}
			onDragLeave={(event: any) => onDragLeave(event)}
			className={cx(addDragTargetStyle, (dragging ? addButtonDraggingStyle : css``))}>
				{!dragging &&
					<Button
						className={addButtonStyle}
						size="sm"
						kind="ghost"
						iconDescription="Add item"
						hasIconOnly
						renderIcon={AddAlt32}
						onClick={(event: any) => addToList(event, index)} />
				}
			</div>
		);
	};

	return (
		<div>
			<AddButton index={0} />
			{
				dataList.map((item: any, index: number) => <>
					<Tile
					key={item.id || index}
					draggable={true}
					onDragStart={(event: any) => onDragStart(event, index)}
					onDragEnd={(event: any) => onDragEnd(event)}
					className={tileStyle}>
						<Button
							className={trashButtonStyle}
							align="left"
							size="sm"
							kind="danger--tertiary"
							iconDescription="Delete item"
							hasIconOnly
							renderIcon={TrashCan32}
							onClick={(event: any) => removeFromList(event, index)} />
						<Draggable16 className={draggableIconStyle} />
						{template(item, index)}
					</Tile>
					<AddButton
						index={index + 1}
						key={index} />
				</>)
			}
		</div>
	);
};
