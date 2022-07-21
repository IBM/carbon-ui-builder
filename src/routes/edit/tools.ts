export const drag = (event: any, dragObj: any) => {
	event.stopPropagation();
	event.dataTransfer.setData('drag-object', JSON.stringify(dragObj));
};

const draggableSelectorDirect = ':scope > [draggable]';
const draggableSelectorColumn = ':scope > .bx--col > [draggable]';
const draggableSelector = `${draggableSelectorDirect}, ${draggableSelectorColumn}`;

export const isHorizontalContainer = (containerElement: HTMLElement) => {
	const allChildrenElements = containerElement.querySelectorAll(draggableSelector);
	if (allChildrenElements.length <= 1) {
		console.info('TODO try to detect orientation from css somehow');
		return true;
	}
	const firstElement = allChildrenElements[0].getBoundingClientRect();
	const secondElement = allChildrenElements[1].getBoundingClientRect();

	return firstElement.bottom > secondElement.top; // the opposite would mean it's vertical container
};

export const getDropIndex = (event: any, containerElement: HTMLElement) => {
	const isHorizontal = isHorizontalContainer(containerElement);

	let dropIndex = 0;

	// find the index of the element user was hovering when dropping
	const iterate = (selector: string, useParentRect = false) => {
		for (const element of containerElement.querySelectorAll(selector)) {
			let rect: any;
			if (useParentRect) {
				rect = element.parentElement?.getBoundingClientRect();
			} else {
				rect = element.getBoundingClientRect();
			}

			if (
				event.clientX > rect.left
				&& event.clientX < rect.right
				&& event.clientY > rect.top
				&& event.clientY < rect.bottom
			) {
				const start = isHorizontal ? rect.left : rect.top;
				const end = isHorizontal ? rect.right : rect.bottom;
				const size = end - start;
				const dropPosition = isHorizontal ? event.clientX : event.clientY;
				if (dropPosition < start + size / 2) {
					// we found the index!
					break;
				}
				dropIndex++;
				break;
			}
			dropIndex++;
		}
	};

	iterate(draggableSelectorDirect);
	iterate(draggableSelectorColumn, true);

	return dropIndex;
};
