import { Options } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import { allComponents } from '../../../../../../sdk/src/fragment-components';
import { addIfNotExist } from '../../../../../../ui-fragment/src/utils';
import { tagNameFromFragment } from '../../../../../../sdk/src/tools';

export const formatOptionsTypescript: Options = {
	plugins: [parserBabel],
	trailingComma: 'none',
	useTabs: true,
	parser: 'babel-ts'
};

export const formatOptionsHtml: Options = {
	plugins: [parserHtml],
	trailingComma: 'none',
	useTabs: true,
	parser: 'html'
};

export const formatOptionsCss: Options = {
	parser: 'css',
	plugins: [parserCss]
};

export const jsonToAngularImports = (json: any) => {
	const imports: any[] = [];

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type) {
			addIfNotExist(imports, component.componentInfo.codeExport.angular?.imports);
		}
	}

	if (json.items) {
		json.items.forEach((item: any) => {
			addIfNotExist(imports, jsonToAngularImports(item));
		});
	}

	return imports;
};

export const getAngularInputsFromJson = (json: any): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.inputs({ json }) || '';
			}
		}
		return '';
	};

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularInputsFromJson(item)).join('\n') : ''}
	`;
};

export const getAngularOutputsFromJson = (json: any): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.outputs({ json }) || '';
			}
		}
		return '';
	};

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularOutputsFromJson(item)).join('\n') : ''}
	`;
};
export const jsonToTemplate = (json: any, fragments: any[]) => {
	if (typeof json === 'string' || !json) {
		return json;
	}

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type && !component.componentInfo.codeExport.angular.isNotDirectExport) {
			return component.componentInfo.codeExport.angular.code({ json, jsonToTemplate, fragments });
		}
	}

	if (json.items) {
		return json.items.map((item: any) => jsonToTemplate(item, fragments)).join('\n');
	}
};

export const getAllSubfragments = (json: any, fragments: any[]) => {
	let sharedComponents: any = {};

	if (json.type === 'fragment') {
		const fragment = fragments.find(f => f.id === json.fragmentId);

		sharedComponents[tagNameFromFragment(fragment)] = fragment;

		sharedComponents = {
			...sharedComponents,
			...getAllSubfragments(fragment.data, fragments)
		};
	}

	json.items?.forEach((item: any) => {
		sharedComponents = {
			...sharedComponents,
			...getAllSubfragments(item, fragments)
		};
	});

	return sharedComponents;
};
