export const drag = (event: any, dragObj: any) => {
	event.stopPropagation();
    event.dataTransfer.setData("drag-object", JSON.stringify(dragObj));
}
