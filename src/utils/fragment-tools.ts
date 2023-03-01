import React from 'react';
import domtoimage from 'dom-to-image';
import ReactDOM from 'react-dom';
import { camelCase, kebabCase, uniq, upperFirst } from 'lodash';
import { matchPath } from 'react-router-dom';
import { getAllFragmentStyleClasses, stringToCssClassName } from '../ui-fragment/src/utils';
import { UIFragment } from '../ui-fragment/src/ui-fragment';

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

export const getFragmentsFromLocalStorage = () => {
	try {
		return validInitialFragments(JSON.parse(localStorage.getItem('localFragments') as string)) || [];
	} catch (error) {
		console.warn(error);
		return [];
	}
};

export const getGlobalStyleClassesFromLocalStorage = () => JSON.parse(localStorage.getItem('globalStyleClasses') as string || '[]');

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

export const getFragmentTemplates = (fragments: any[]) => (
	fragments.filter((fragment: any) => !!fragment.labels?.includes('template'))
);

export const tagNameFromFragment = (fragment: any) => {
	// TODO fragment can have a tag name?
	return kebabCase(fragment.title);
};

export const classNameFromFragment = (fragment: any) => {
	// TODO fragment can have a class name?
	return upperFirst(camelCase(fragment.title));
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

export const openFragmentPreview = (fragment: any) => {
	window.open(
		`/view/${fragment.id}`,
		'',
		`popup,width=${fragment.width || '800'},height=${fragment.height || '600'}`
	);
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
