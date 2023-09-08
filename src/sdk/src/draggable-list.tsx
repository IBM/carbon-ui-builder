import React, { useState, useRef } from 'react';
import { Button, Tile } from '@carbon/react';
import { css, cx } from 'emotion';
import {
	AddAlt,
	Draggable,
	TrashCan
} from '@carbon/react/icons';

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
	position: absolute;

	button {
		border-color: transparent;
	}
`;

const draggableIconStyle = css`
	position: absolute;
	top: 50%;
	left: 0;
`;

const tileStyle = css`
	position: relative;
	z-index: 1;
`;

export const DraggableTileList = ({
	template, // Functional component
	Template,
	onDragOver: dragOver = (_: any) => true,	// Override onDragOver event
	removeItemFromList: removeFromList = (_: any) => true,	// Override removeItemFromList
	dataList,
	setDataList,
	updateItem,
	extraTemplateProps,
	defaultObject // Default object created
}: any) => {
	const [dragging, setDragging] = useState(false);
	const draggedItem = useRef<HTMLDivElement>();
	const [draggedIndex, setDraggedIndex] = useState(-1);

	const onDragStart = (event: any, index: number) => {
		setDragging(true);
		setDraggedIndex(index);
		event.dataTransfer.setData('item-data', JSON.stringify(dataList[index]));
		draggedItem.current = event.currentTarget;
	};

	const onDragEnd = (_: any) => {
		setDragging(false);
		setDraggedIndex(-1);
		draggedItem.current = undefined;
	};

	const onDragOver = (event: any) => {
		// Prevent drop if user
		if (dragOver(event) === false) {
			return false;
		}

		event.preventDefault();
		// Adds styles only if dragged item reference exists
		// otherwise enters height adjustment loop
		if (draggedItem.current?.clientHeight) {
			event.currentTarget.style.setProperty('--drag-target-height', `${(draggedItem.current?.clientHeight)}px`);
			event.currentTarget.style.setProperty('--outline', '2px dashed #0f62fe');
		}
	};

	const onDragLeave = (event: any) => {
		event.currentTarget.style.setProperty('--drag-target-height', '');
		event.currentTarget.style.setProperty('--outline', '');
	};

	const onDrop = (event: any, index: number) => {
		event.preventDefault();

		// parse only if data exists
		const data = event.dataTransfer.getData('item-data');
		if (!data) {
			return false;
		}
		const item = JSON.parse(data);
		// Duplicate the list to perform splice operations
		// Splice makes it easier to remove from previous position & add to new position
		const newList = [...dataList];

		// Only remove item from list if item is part of list
		if (draggedIndex >= 0) {
			newList.splice(draggedIndex, 1);
		}
		newList.splice(index, 0, item);
		setDataList(newList);
	};

	const addToList = (index: number) => {
		setDataList([
			...dataList.slice(0, index),
			{ ...defaultObject },
			...dataList.slice(index)
		]);
	};

	const removeItemFromList = (index: number) => {
		if (removeFromList(index) === false) {
			return false;
		}

		setDataList([
			...dataList.slice(0, index),
			...dataList.slice(index + 1)
		]);
	};

	const AddButton = ({ index = 0 }: any) => {
		return (
			<div
			onDrop={(event: any) => onDrop(event, index)}
			onDragOver={(event: any) => onDragOver(event)}
			onDragLeave={(event: any) => onDragLeave(event)}
			className={cx(addDragTargetStyle, (dragging ? addButtonDraggingStyle : css``))}>
				{
					!dragging
					&& <Button
						className={addButtonStyle}
						size="sm"
						kind="ghost"
						iconDescription="Add item"
						hasIconOnly
						renderIcon={AddAlt}
						onClick={(event: any) => {
							event.stopPropagation();
							addToList(index);
						}} />
				}
			</div>
		);
	};

	return (
		<div>
			<AddButton index={0} />
			{
				dataList.map((item: any, index: number) => <React.Fragment key={`tile-and-button-${index}`}>
					<Tile
					draggable='true'
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
							renderIcon={TrashCan}
							onClick={(event: any) => {
									event.stopPropagation();
									removeItemFromList(index);
							}} />
						<Draggable size={16} className={draggableIconStyle} />
						{
							Template
							? <Template item={item} index={index} updateItem={updateItem} {...extraTemplateProps} />
							: template(item, index)
						}
					</Tile>
					<AddButton index={index + 1} />
				</React.Fragment>)
			}
		</div>
	);
};
