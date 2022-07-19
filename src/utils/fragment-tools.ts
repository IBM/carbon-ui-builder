import React from 'react';
import domtoimage from 'dom-to-image';
import ReactDOM from 'react-dom';
import { Fragment } from '../components';
import { camelCase, kebabCase, upperFirst } from 'lodash';
import { matchPath } from 'react-router-dom';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export const validInitialFragments = (localFragments: any[] | undefined) => {
	if (!localFragments || !Array.isArray(localFragments)) {
		return [];
	}

	return localFragments.filter((fragment: any) => !!fragment.id && typeof fragment.id === 'string');
};

export const getFragmentsFromLocalStorage = () =>
	validInitialFragments(JSON.parse(localStorage.getItem('localFragments') as string)) || [];

export const getFragmentPreview = async (fragment: any, props: RenderProps, outline = false) => {
	const element = document.createElement('div');
	element.className = 'render-preview';

	(element as HTMLElement).style.position = 'absolute';
	(element as HTMLElement).style.top = '0';
	(element as HTMLElement).style.left = '0';
	(element as HTMLElement).style.zIndex = '-1';
	(element as HTMLElement).style.width = `${props.width || 800}px`;
	(element as HTMLElement).style.height = `${props.height || 400}px`;
	(element as HTMLElement).style.minHeight = `${props.height || 400}px`;
	ReactDOM.render(React.createElement(Fragment, { fragment, outline }), element);
	document.body.appendChild(element);

	await sleep(100); // wait for render to finish

	const imageBlob = await domtoimage.toBlob(element as Node);
	(element as HTMLElement).remove();
	return imageBlob;
};

export const getFragmentTemplates = (fragments: any[]) => (
	fragments.filter((fragment: any) => !!fragment.labels?.includes('template'))
);

export const getAllComponentStyleClasses = (componentObj: any, fragments: any[]) => {
	let styleClasses: any = {};

	// convert into an object so all classes are unique
	componentObj.cssClasses?.forEach((cssClass: any) => {
		// NOTE do we need to merge them deeply?
		styleClasses[cssClass.id] = cssClass;
	});

	componentObj.items?.map((co: any) => {
		const coClasses = getAllComponentStyleClasses(co, fragments);
		styleClasses = {
			...styleClasses,
			...coClasses
		};

		if (co.type === 'fragment') {
			const fragment = fragments.find(f => f.id === co.fragmentId);

			styleClasses = {
				...styleClasses,
				// we can't avoid this without a messy declare+reassign+export
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				...getAllFragmentStyleClasses(fragment || {}, fragments)
			};
		}
	});

	return styleClasses;
};

export const tagNameFromFragment = (fragment: any) => {
	// TODO fragment can have a tag name?
	return kebabCase(fragment.title);
};

export const classNameFromFragment = (fragment: any) => {
	// TODO fragment can have a class name?
	return upperFirst(camelCase(fragment.title));
};

export const getAllFragmentStyleClasses = (fragment: any, fragments: any[] = []) => {
	if (!fragment || !fragment.data) {
		return [];
	}

	const allClasses = {
		...getAllComponentStyleClasses(fragment, fragments),
		...getAllComponentStyleClasses(fragment.data, fragments)
	};
	return Object.values(allClasses);
};

export const getEditScreenParams = () => {
	return matchPath('/edit/:id', window.location.pathname)?.params;
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
	if (!fragment || !fragment.data) {
		return false;
	}

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

export const getRandomId = () => `${Math.random().toString().slice(2)}${Math.random().toString().slice(2)}`;

export const getFragmentDuplicate = (fragments: any, fragment: any, overrides = {}) => {
	// copy current fragment and change fragment title
	const fragmentCopy = JSON.parse(JSON.stringify(fragment));
	fragmentCopy.title = getUniqueFragmentName(fragments, fragmentCopy.title);
	fragmentCopy.id = getRandomId();
	return { ...fragmentCopy, ...overrides };
};

export const getUrlFromBlob = async (blob: any) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob ? blob : new Blob());
		reader.onloadend = () => resolve(reader.result ? reader.result.toString() : '');
	});
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
