import React from 'react';
import domtoimage from 'dom-to-image';
import ReactDOM from 'react-dom';
import { Fragment } from '../components';

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

export const getUniqueFragmentName = (fragments: Array<any>, baseName: string) => {
	const nameRegEx = new RegExp(String.raw`(.*)\s+(copy)*(\s+(\d+))?$`);
	const nameMatch = baseName.match(nameRegEx);
	let count = 0;

	let nameBase = baseName;
	// If match, increment the count and update name base and new name
	if (nameMatch) {
		nameBase = baseName.replace(nameRegEx, '$1');
		count = Number.parseInt(baseName.replace(nameRegEx, '$4'), 10);
		if (!count) {
			count = 0;
		}
	}

	// Get a list containing names of all duplicates of original fragment
	// e.g. [ "Fragment copy", "Fragment copy 1", "Fragment copy 7", ...]
	const names: string[] = [];
	fragments.forEach((fragment) => {
		if (fragment.title.includes(nameBase)) {
			names.push(fragment.title);
		}
	});

	if (names.length <= 1) {
		// because the fragment we're copying is already in there
		return `${nameBase} copy`;
	}

	const highestNumber = names
		.map((n) => Number.parseInt(n.replace(nameRegEx, '$4'), 10))
		.filter((n) => !isNaN(n)).sort((a, b) => b - a)
		.shift();

	return `${nameBase} copy ${highestNumber && count < highestNumber ? highestNumber + 1 : count + 1}`;
};

export const duplicateFragment = (fragments: any, fragment: any, options = {}) => {
	// copy current fragment and change fragment title
	let fragmentCopy = JSON.parse(JSON.stringify(fragment));
	fragmentCopy.title = getUniqueFragmentName(fragments, fragmentCopy.title);
	fragmentCopy.id = `${Math.random().toString().slice(2)}${Math.random().toString().slice(2)}`;
	return Object.assign({}, fragmentCopy, options);
};
