import { Options } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import Handlebars from 'handlebars';
import { allComponents, getCustomComponentByType, tagNameFromFragment } from '@carbon-builder/sdk-react';
import { addIfNotExist } from '@carbon-builder/player-react';
import { camelCase } from 'lodash';

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

const getTemplateModel = (json: any) => ({
	variableName: camelCase(json.codeContext?.name || ''),
	model: json
});

const parseTemplate = (template: string, json: any) =>
	(Handlebars.compile(template || ''))(getTemplateModel(json));

export const jsonToAngularImports = (json: any) => {
	const imports: any[] = [];

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type) {
			addIfNotExist(imports, component.componentInfo.codeExport.angular?.latest.imports);
		}
	}

	if (json.items) {
		json.items.forEach((item: any) => {
			addIfNotExist(imports, jsonToAngularImports(item));
		});
	}

	return imports;
};

export const getAngularInputsFromJson = (json: any, customComponentsCollections: any[]): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.latest.inputs({ json }) || '';
			}
		}
		const component = getCustomComponentByType(json.type, customComponentsCollections);

		return parseTemplate(component?.angular?.inputs, json);
	};

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularInputsFromJson(item, customComponentsCollections)).join('\n') : ''}
	`;
};

export const getAngularOutputsFromJson = (json: any, customComponentsCollections: any[]): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.latest.outputs({ json }) || '';
			}
		}
		const component = getCustomComponentByType(json.type, customComponentsCollections);

		return parseTemplate(component?.angular?.outputs, json);
	};

	return `${getOne(json)} ${
		json.items
			? json.items.map((item: any) => getAngularOutputsFromJson(item, customComponentsCollections)).join('\n')
			: ''}
	`;
};

export const jsonToTemplate = (json: any, fragments: any[], customComponentsCollections: any[]) => {
	if (typeof json === 'string' || !json) {
		return json;
	}

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type && !component.componentInfo.codeExport.angular.latest.isNotDirectExport) {
			return component.componentInfo.codeExport.angular.latest.code({ json, jsonToTemplate, fragments, customComponentsCollections });
		}
	}

	if (json.items) {
		return json.items.map((item: any) => jsonToTemplate(item, fragments, customComponentsCollections)).join('\n');
	}

	const activeCollection = customComponentsCollections.find((collection) => collection.name === json.componentsCollection);
	if (!activeCollection) {
		return;
	}

	// find the angular.template from the collection, parse it and return it as a string
	const activeComponent = activeCollection.components?.find((component: any) => component.type === json.type);
	if (!activeComponent?.angular?.template) {
		return;
	}

	const htmlPreview = parseTemplate(activeComponent.angular.template, json);
	return htmlPreview;
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
