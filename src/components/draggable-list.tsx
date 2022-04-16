import React,
{
	useEffect,
	useState,
	useRef
} from 'react';
import { Button, Tile } from 'carbon-components-react';
import {
	AddAlt32,
	Draggable16,
	TrashCan32
} from '@carbon/icons-react';

export const DraggableTileList = ({
	// Functional component
	template,
	dataList,
	setListData,
	// Values in list being updated
	handleStepUpdate,
	// Default object created
	defaultObject
}: any) => {
	const [list, setList] = useState<any[]>([]);
	const [dragging, setDragging] = useState(false);
	const draggedItem = useRef<HTMLDivElement>();

	// Set initial list
	useEffect(() => {
		setList(dataList);
	}, [setList, dataList]);

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
		event.currentTarget.style.transition = 'height 0.15s ease-out';
		event.currentTarget.style.height = `${(draggedItem.current?.clientHeight || 0)}px`;

	};

	const onDragLeave = (event: any) => {
		console.log(event.currentTarget.class);
		event.currentTarget.style.transition = 'height 0.15s ease-in';
		event.currentTarget.style.height = '32px';
	};

	const onDrop = (event: any, index: number) => {
		const previousIndex = event.dataTransfer.getData('index');
		const item = { ...list[previousIndex] };
		const newList = [...list];
		newList.splice(previousIndex, 1);
		newList.splice(index, 0, item);
		setListData(newList);
	};

	const addToList = (event: any, index: number) => {
		event.stopPropagation();
		const newList = [...list];
		if (index) {
			newList.splice(index, 0, defaultObject);
		} else {
			newList.splice(0, 0, defaultObject);
		}

		setListData(newList);
	};

	const removeFromList = (event: any, index: number) => {
		event.stopPropagation();
		const newList = [...list];
		newList.splice(index, 1);
		setListData(newList);
	};

	const AddButton = ({ index }: any) => {
		return (
			<div
			onDrop={(event: any) => onDrop(event, index)}
			onDragOver={(event: any) => onDragOver(event)}
			onDragLeave={(event: any) => onDragLeave(event)}
			style={{
				height: 32,
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				marginBottom: '0.5rem',
				outline: dragging ? '1px dashed #1666fe' : '',
				outlineOffset: -2
			}}>
				{!dragging &&
					<Button
						size="sm"
						kind="ghost"
						iconDescription="Add step"
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
				list.map((step: any, index: number) => <>
					<Tile
					key={index || step.id}
					draggable={true}
					onDragStart={(event: any) => onDragStart(event, index)}
					onDragEnd={(event: any) => onDragEnd(event)}
					style={{ marginBottom: '0.5rem', position: 'relative' }}>
						<Button
							style={{ marginLeft: 12, top: 0, right: 0, position: 'absolute', borderColor: 'transparent' }}
							align="left"
							size="sm"
							kind="danger--tertiary"
							iconDescription="Delete item"
							hasIconOnly
							renderIcon={TrashCan32}
							onClick={(event: any) => removeFromList(event, index)} />
						<Draggable16 style={{ position: 'absolute', top: '50%', left: 0 }} />
						{template(handleStepUpdate, step, index)}
					</Tile>
					<AddButton
						index={index + 1}
						key={index} />
				</>)
			}
		</div>
	);
};
