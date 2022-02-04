import React from 'react';
import domtoimage from 'dom-to-image';
import ReactDOM from 'react-dom';
import { Fragment } from '../components';
import { camelCase } from 'lodash';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface RenderProps {
	id: string,
	name: string,
	width?: number,
	height?: number,
	format?: string,
	preview?: { // only sent for preview
		format?: string, // optional
		width: number,
		height: number
	}
}

export const getFragmentPreview = async(fragment: any, props: RenderProps) => {
	const element = document.createElement('div');
	element.className = 'render-preview';

	(element as HTMLElement).style.position = 'absolute';
	(element as HTMLElement).style.top = '0';
	(element as HTMLElement).style.left = '0';
	(element as HTMLElement).style.zIndex = '-1';
	(element as HTMLElement).style.width = `${props.width || 800}px`;
	(element as HTMLElement).style.height = `${props.height || 400}px`;
	(element as HTMLElement).style.minHeight = `${props.height || 400}px`;
	ReactDOM.render(React.createElement(Fragment, {fragment}), element);
	document.body.appendChild(element);

	await sleep(100); // wait for render to finish

	const imageBlob = await domtoimage.toBlob(element as Node);
	(element as HTMLElement).remove();
	return imageBlob;
};

export const getAllComponentStyleClasses = (componentObj: any) => {
	let styleClasses: any = {};

	// convert into an object so all classes are unique
	componentObj.cssClasses?.forEach((cssClass: any) => {
		// NOTE do we need to merge them deeply?
		styleClasses[cssClass.id] = cssClass;
	});

	componentObj.items?.map((co: any) => {
		const coClasses = getAllComponentStyleClasses(co);
		styleClasses = {
			...styleClasses,
			...coClasses
		};
	});

	return styleClasses;
};

export const getAllFragmentStyleClasses = (fragment: any) => {
	if (!fragment || !fragment.data) { return []; }

	return Object.values(getAllComponentStyleClasses(fragment.data));
};

export const hasComponentStyleClasses = (componentObj: any) => {
	if (componentObj.cssClasses) {
		return true;
	}

	if (componentObj.items) {
		return componentObj.items.some((item: any) => hasComponentStyleClasses(item));
	}

	return false;
};

export const hasFragmentStyleClasses = (fragment: any) => {
	if (!fragment || !fragment.data) { return false; }

	return hasComponentStyleClasses(fragment.data);
};

export const reactClassNamesFromComponentObj = (componentObj: any) =>
	componentObj.cssClasses
	&& Array.isArray(componentObj.cssClasses)
	&& componentObj.cssClasses.length > 0
	? `className='${componentObj.cssClasses.map((cc: any) => cc.id).join(' ')}'`
	: '';

export const angularClassNamesFromComponentObj = (componentObj: any) =>
	componentObj.cssClasses
	&& Array.isArray(componentObj.cssClasses)
	&& componentObj.cssClasses.length > 0
	? `class='${componentObj.cssClasses.map((cc: any) => cc.id).join(' ')}'`
	: '';

export const nameStringToVariableString = (name: string) => camelCase(name);
