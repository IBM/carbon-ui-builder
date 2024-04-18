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

const getTemplateModel = (json: any, fragments: any[], customComponentsCollections: any[]): any => ({
	variableName: camelCase(json.codeContext?.name || ''),
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	children: json.items ? jsonToTemplate(json.items, fragments, customComponentsCollections) : undefined,
	model: json
});

const parseTemplate = (template: string, json: any, fragments: any[], customComponentsCollections: any[]) =>
	(Handlebars.compile(template || ''))(getTemplateModel(json, fragments, customComponentsCollections));

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

export const getAngularInputsFromJson = (json: any, fragments: any[], customComponentsCollections: any[]): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.latest.inputs({ json }) || '';
			}
		}
		const component = getCustomComponentByType(json.type, customComponentsCollections);

		return parseTemplate(component?.angular?.inputs, json, fragments, customComponentsCollections);
	};

	return `${getOne(json)} ${json.items
		? json.items.map((item: any) => getAngularInputsFromJson(item, fragments, customComponentsCollections)).join('\n')
		: ''}
	`;
};

export const getAngularOutputsFromJson = (json: any, fragments: any[], customComponentsCollections: any[]): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.latest.outputs({ json }) || '';
			}
		}
		const component = getCustomComponentByType(json.type, customComponentsCollections);

		return parseTemplate(component?.angular?.outputs, json, fragments, customComponentsCollections);
	};

	return `${getOne(json)} ${
		json.items
			? json.items.map((item: any) => getAngularOutputsFromJson(item, fragments, customComponentsCollections)).join('\n')
			: ''}
	`;
};

export const jsonToTemplate = (json: any, fragments: any[], customComponentsCollections: any[]) => {
	if (typeof json === 'string' || !json) {
		return json;
	}

	let itemsTemplate;

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type && !component.componentInfo.codeExport.angular.latest.isNotDirectExport) {
			return component.componentInfo.codeExport.angular.latest.code({ json, jsonToTemplate, fragments, customComponentsCollections });
		}
	}

	if (json.items) {
		itemsTemplate = json.items.map((item: any) => jsonToTemplate(item, fragments, customComponentsCollections)).join('\n');
	}

	const activeCollection = customComponentsCollections.find((collection) => collection.name === json.componentsCollection);
	if (!activeCollection) {
		return itemsTemplate;
	}

	// find the angular.template from the collection, parse it and return it as a string
	const activeComponent = activeCollection.components?.find((component: any) => component.type === json.type);
	if (!activeComponent?.angular?.template) {
		return itemsTemplate;
	}

	let fullTemplate = activeComponent.angular.template;

	if (itemsTemplate) {
		fullTemplate = fullTemplate.split('{{children}}').join(itemsTemplate);
	}

	const htmlPreview = parseTemplate(fullTemplate, json, fragments, customComponentsCollections);
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
