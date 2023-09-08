import React from 'react';
import domtoimage from 'dom-to-image';
import ReactDOM from 'react-dom';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';
import { expandJsonToState, getAllFragmentStyleClasses, stringToCssClassName } from '../../ui-fragment/src/utils';
import { camelCase, kebabCase, uniq, upperFirst } from 'lodash';
import { CURRENT_MODEL_VERSION } from '../../utils/model-convertor';
import { allComponents as allUIComponents } from '../../ui-fragment/src/components';
import { Action } from '../../ui-fragment/src/types';

export let componentCounter = 2; // actually initialized (again) in Fragment TODO refactor this

export interface RenderProps {
	id: string;
	name: string;
	width?: number;
	height?: number;
	format?: string;
	preview?: { // only sent for preview
		format?: string; // optional
		width: number;
		height: number;
	};
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRandomId = () => `${Math.random().toString().slice(2)}${Math.random().toString().slice(2)}`;

export const getUrlFromBlob = async (blob: any) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob ? blob : new Blob());
		reader.onloadend = () => resolve(reader.result ? reader.result.toString() : '');
	});
};

export const getFragmentPreview = async (fragment: any, props: RenderProps) => {
	const element = document.createElement('div');
	element.className = 'render-preview';

	(element as HTMLElement).style.position = 'absolute';
	(element as HTMLElement).style.top = '0';
	(element as HTMLElement).style.left = '0';
	(element as HTMLElement).style.zIndex = '-1';
	(element as HTMLElement).style.backgroundColor = 'white';
	(element as HTMLElement).style.width = `${props.width || 800}px`;
	(element as HTMLElement).style.height = `${props.height || 400}px`;
	(element as HTMLElement).style.minHeight = `${props.height || 400}px`;
	ReactDOM.render(React.createElement(UIFragment, { state: fragment, setState: (_state: any) => {} }), element);
	document.body.appendChild(element);

	await sleep(100); // wait for render to finish

	const imageBlob = await domtoimage.toBlob(element as Node);
	(element as HTMLElement).remove();
	return imageBlob;
};

export const getFragmentPreviewUrl = async (fragment: any) => {
	const renderProps: RenderProps = {
		id: fragment.id,
		name: fragment.title,
		width: 800,
		height: 400,
		preview: {
			format: 'png',
			width: 330,
			height: 200
		}
	};

	const imageBlob = await getFragmentPreview(fragment, renderProps);
	return getUrlFromBlob(imageBlob);
};

export const drag = (event: any, dragObj: any) => {
	event.stopPropagation();
	event.dataTransfer.setData('drag-object', JSON.stringify(dragObj));
};

const draggableSelectorDirect = ':scope > [draggable]';
const draggableSelectorColumn = ':scope > .cds--col > [draggable]';
const draggableSelector = `${draggableSelectorDirect}, ${draggableSelectorColumn}`;

export const getParentComponent = (state: any, child: any) => {
	if (state && state.items) {
		if (state.items.includes(child)) {
			return state;
		}
		for (let i = 0; i < state.items.length; i++) {
			const component = state.items[i];
			const parent: any = getParentComponent(component, child);
			if (parent) {
				return parent;
			}
		}
	}

	return null;
};

const updatedList = (list: any[], item: any, dropInIndex?: number) => {
	if (dropInIndex === undefined) {
		return [...list, item];
	}

	return [...list.slice(0, dropInIndex), item, ...list.slice(dropInIndex)];
};

export const getHighestId = (componentObj: any) => {
	if (!componentObj) {
		return 0;
	}

	if (!componentObj.items || !componentObj.items.length) {
		return +componentObj.id || 0;
	}

	return Math.max(...componentObj.items.map((item: any) => getHighestId(item)), (+componentObj.id || 0));
};

export const updateComponentCounter = (componentObj: any) => {
	componentCounter = getHighestId(componentObj) + 1;
};

export const getNewId = () => {
	const id = '' + componentCounter++;

	// beyond 20 digits, js goes to scientific notation so we'd get collisions
	if (id.length > 20) {
		return getRandomId();
	}

	return id;
};

export const stateWithoutComponent = (state: any, componentId: number) => {
	if (state.items) {
		const componentIndex = state.items.findIndex((component: any) => component.id === componentId);
		if (componentIndex >= 0) {
			return {
				...state,
				items: [...state.items.slice(0, componentIndex), ...state.items.slice(componentIndex + 1)]
			};
		}

		return {
			...state,
			items: state.items.map((item: any) => stateWithoutComponent(item, componentId))
		};
	}

	return { ...state };
};

export const initializeIds = (componentObj: any, forceNewIds = false) => {
	let id = null;
	if (forceNewIds) {
		id = getNewId();
	}
	id = id || componentObj.id || getNewId();
	// name is used in form items and for angular inputs and outputs variable names
	let name = componentObj.codeContext?.name;
	if (name === undefined || forceNewIds) {
		name = `${componentObj.type}-${id}`;
	}

	return {
		...componentObj,
		id,
		items: componentObj.items ? componentObj.items.map((co: any) => initializeIds(co, forceNewIds)) : undefined,
		codeContext: {
			...componentObj.codeContext,
			name
		}
	};
};

export const updatedState = (state: any, dragObj: any, dropInId?: number, dropInIndex?: number) => {
	if (!state) { // NOTE is this needed?
		return;
	}

	// give unique ids to newly dropped components
	dragObj.component = initializeIds(dragObj.component);

	// only update
	if (dragObj.type === 'update') {
		if (state.id && state.id === dragObj.component.id) {
			return {
				...state,
				...dragObj.component
			};
		}
		if (state.items) {
			state.items = state.items.map((item: any) => updatedState(item, dragObj, dropInId, dropInIndex));
		}

		return { ...state };
	}

	if (dragObj.type === 'move') {
		state = stateWithoutComponent(state, dragObj.component.id);
		dragObj.type = 'insert';
	}

	if (state.items) {
		state.items = state.items.map((item: any) => updatedState(item, dragObj, dropInId, dropInIndex));
	}

	if (!dropInId) {
		return state.items && !state.type ? {
			...state,
			items: updatedList(state.items, dragObj.component, dropInIndex)
		} : { ...state };
	}
	/// ////////// TODO NOTE clean the container items with 1 item //////////////
	if (state.id && state.id === dropInId) {
		// add data into state
		if (state.items) {
			return {
				...state,
				items: updatedList(state.items, dragObj.component, dropInIndex),
				id: state.id
			};
		}

		// convert into a list of components, move current component into list
		return {
			// TODO should this be a `type: container`?
			id: getNewId(),
			items: updatedList([{ ...state }], dragObj.component, dropInIndex)
		};
	}

	if (dropInId) { // probably don't wanna add it here since it didn't match anything and it should somewhere
		return { ...state };
	}

	return state.items ? {
		...state,
		items: updatedList(state.items, dragObj.component, dropInIndex)
	} : { ...state };
};

export const getComponentById = (componentObj: any, id: number) => {
	if (!componentObj || !id) {
		return undefined;
	}

	if (componentObj.id === id) {
		return componentObj;
	}

	if (componentObj.items) {
		for (let i = 0; i < componentObj.items.length; i++) {
			const component: any = getComponentById(componentObj.items[i], id);
			if (component) {
				return component;
			}
		}
	}

	return undefined;
};

export const hasMicroLayouts = (fragment: any): boolean => {
	if (fragment.type === 'fragment') {
		return true;
	}

	if (fragment.data) {
		return hasMicroLayouts(fragment.data);
	}

	if (fragment.items) {
		return fragment.items.some((item: any) => hasMicroLayouts(item));
	}

	return false;
};

export const getShallowFragmentJsonExport = (fragment: any, fragments: any[], styleClasses: any[]) => {
	return {
		version: CURRENT_MODEL_VERSION,
		id: fragment.id,
		lastModified: fragment.lastModified,
		title: fragment.title,
		data: fragment.data,
		cssClasses: fragment.cssClasses,
		allCssClasses: getAllFragmentStyleClasses(fragment, [], styleClasses),
		labels: fragment.labels
	};
};

export const getAllMicrolayoutIdsFromFragment = (fragment: any): any[] => {
	if (fragment.type === 'fragment') {
		return [fragment.fragmentId];
	}

	if (fragment.data) {
		return getAllMicrolayoutIdsFromFragment(fragment.data);
	}

	if (fragment.items) {
		return uniq(fragment.items
			.flatMap((item: any) => getAllMicrolayoutIdsFromFragment(item))
			.filter((item: any) => !!item));
	}

	return [];
};

export const getFragmentJsonExport = (fragment: any, fragments: any[], styleClasses: any[]) => {
	if (!hasMicroLayouts(fragment)) {
		return getShallowFragmentJsonExport(fragment, fragments, styleClasses);
	}

	// get all microlayouts
	const microlayoutIds = getAllMicrolayoutIdsFromFragment(fragment);

	const microlayouts = fragments.filter((f: any) => microlayoutIds.includes(f.id));

	return [
		getShallowFragmentJsonExport(fragment, fragments, styleClasses),
		...microlayouts
	];
};

export const getFragmentJsonExportString = (fragment: any, fragments: any[], styleClasses: any[]) => {
	return JSON.stringify(getFragmentJsonExport(fragment, fragments, styleClasses), null, 2);
};

export const getExpandedFragmentState = (fragment: any, fragments: any[] = [], styleClasses: any[] = []) => {
	return expandJsonToState(getFragmentJsonExport(fragment, fragments, styleClasses));
};

export const getSelectedComponent = (fragment: any) => {
	if (!fragment) {
		return undefined;
	}

	return getComponentById(fragment.data, fragment.selectedComponentId);
};

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

export const filenameToLanguage = (filename: string) => {
	const filenameLowercase = filename.toLowerCase();

	if (
		filenameLowercase.endsWith('ts') ||
		filenameLowercase.endsWith('tsx')
	) {
		return 'typescript';
	}

	if (
		filenameLowercase.endsWith('js') ||
		filenameLowercase.endsWith('jsx')
	) {
		return 'javascript';
	}

	if (
		filenameLowercase.endsWith('css') ||
		filenameLowercase.endsWith('scss')
	) {
		return 'scss';
	}

	if (
		filenameLowercase.endsWith('json')
	) {
		return 'json';
	}

	if (
		filenameLowercase.endsWith('html')
	) {
		return 'html';
	}

	return 'text';
};

export const reactClassNamesFromComponentObj = (componentObj: any) => {
	let classList = componentObj.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (componentObj.style) {
		if (classList.length > 0) {
			classList += ' ';
		}
		classList += stringToCssClassName(componentObj.codeContext.name);
	}

	return classList.length > 0
		? `className='${classList}'`
		: '';
};

export const angularClassNamesFromComponentObj = (componentObj: any) => {
	let classList = componentObj.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (componentObj.style) {
		if (classList.length > 0) {
			classList += ' ';
		}
		classList += stringToCssClassName(componentObj.codeContext.name);
	}

	return classList.length > 0
		? `class='${classList}'`
		: '';
};

export const nameStringToVariableString = (name: string) => camelCase(name);

export const tagNameFromFragment = (fragment: any) => {
	// TODO fragment can have a tag name?
	return kebabCase(fragment.title);
};

export const classNameFromFragment = (fragment: any) => {
	// TODO fragment can have a class name?
	return upperFirst(camelCase(fragment.title));
};

export const signalsFromType = (type: string) => {
	for (const component of Object.values(allUIComponents) as any[]) {
		if (component.type === type) {
			return component.signals || [];
		}
	}
	return [];
};

export const allComponentsFromComponent = (componentObj: any) => {
	let components: any[] = [];
	if (componentObj.items) {
		components = [
			...componentObj.items,
			...componentObj.items.flatMap((item: any) => allComponentsFromComponent(item)).filter((item: any) => !!item)
		];
	}
	return components;
};

export const allComponentsFromFragment = (fragment: any) => {
	return allComponentsFromComponent(fragment.data);
};

export const actionDestinationsFromFragment = (fragment: any, _action: Action) => {
	const componentsWithSlots = (Object.values(allUIComponents) as any[]).filter((component: any) => !!component.slots);

	return allComponentsFromFragment(fragment)
		.filter((componentObj: any) => componentsWithSlots.find((componentWithSlot: any) => componentWithSlot.type === componentObj.type))
		.map((componentObj: any) => ({ text: `${componentObj.type}-${componentObj.id}`, id: componentObj.id }));
};

export const slotsFromFragmentSignalAndDestination = (fragment: any, sourceId: number, signal: string, destinationId: number) => {
	// get sourceType from source id - USED FOR NOT YET SUPPORTED SIGNAL PARAMS
	// const sourceComponent = getComponentById(fragment.data, sourceId);
	// if (!sourceComponent) {
	// 	return [];
	// }

	// get signal params from sourceType and signal - NOT YET SUPPORTED

	// get destinationType from destination id
	const destinationComponent = getComponentById(fragment.data, destinationId);
	if (!destinationComponent) {
		return [];
	}

	// get destination slots compatible with signal
	const destinationModule = (Object.values(allUIComponents) as any[]).find((component: any) => component.type === destinationComponent.type);
	// TODO filter based on params - NOT YET SUPPORTED
	return Object.keys(destinationModule?.slots || {});
};

export const slotsFromType = (type: string) => {
	for (const component of Object.values(allUIComponents) as any[]) {
		if (component.type === type) {
			return component.slots || [];
		}
	}
	return [];
};
