import { camelCase, kebabCase, upperFirst } from 'lodash';
import { matchPath } from 'react-router-dom';
import { stringToCssClassName } from '../ui-fragment/src/utils';
import { getRandomId } from '../sdk/src/tools';

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

export const getFragmentDuplicate = (fragments: any, fragment: any, overrides = {}) => {
	// copy current fragment and change fragment title
	const fragmentCopy = JSON.parse(JSON.stringify(fragment));
	fragmentCopy.title = getUniqueFragmentName(fragments, fragmentCopy.title);
	fragmentCopy.id = getRandomId();
	return { ...fragmentCopy, ...overrides };
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
