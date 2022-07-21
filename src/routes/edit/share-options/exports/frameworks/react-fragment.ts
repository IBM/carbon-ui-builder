import { sortedUniq } from 'lodash';
import { format as formatPrettier, Options } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserCss from 'prettier/parser-postcss';
import { allComponents } from '../../../../../fragment-components';
import { classNameFromFragment, getAllFragmentStyleClasses, hasFragmentStyleClasses, tagNameFromFragment } from '../../../../../utils/fragment-tools';

const format = (source: string, options?: Options | undefined) => {
	// we're catching and ignorring errors so live editing doesn't throw errors
	try {
		return formatPrettier(source, options);
	} catch (_) {
		return source;
	}
};

const formatOptions: Options = {
	plugins: [parserBabel],
	trailingComma: 'none',
	useTabs: true
};

const formatOptionsCss: Options = {
	parser: 'css',
	plugins: [parserCss]
};

const addIfNotExist = (arr: any[], items: any[]) => {
	items.forEach(item => {
		if (!arr.includes(item)) {
			arr.push(item);
		}
	});
	return arr;
};

const jsonToCarbonImports = (json: any) => {
	const imports: any[] = [];

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type) {
			const componentImport = Array.isArray(component.componentInfo.codeExport.react.imports) ?
				component.componentInfo.codeExport.react.imports : component.componentInfo.codeExport.react.imports({ json });

			addIfNotExist(imports, componentImport);
		}
	}

	if (json.items) {
		json.items.forEach((item: any) => {
			addIfNotExist(imports, jsonToCarbonImports(item));
		});
	}

	return imports;
};

export const jsonToTemplate = (json: any, fragments: any[]) => {
	if (typeof json === 'string' || !json) {
		return json;
	}

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type && !component.componentInfo.codeExport.react.isNotDirectExport) {
			return component.componentInfo.codeExport.react.code({ json, jsonToTemplate, fragments });
		}
	}

	if (json.items) {
		return json.items.map((item: any) => jsonToTemplate(item, fragments)).join('\n');
	}
};

export const getAdditionalCode = (componentObj: any, fragments: any[]) => {
	if (typeof componentObj === 'string' || !componentObj) {
		return componentObj;
	}
	let collectedCode = {};

	for (const [key, component] of Object.entries(allComponents)) {
		if (componentObj.type === key && !component.componentInfo.codeExport.react.isNotDirectExport) {
			if (component.componentInfo.codeExport.react.additionalCode) {
				collectedCode = { ...collectedCode, ...component.componentInfo.codeExport.react.additionalCode(componentObj) };
			}
		}
	}

	if (componentObj.items) {
		componentObj.items.forEach((item: any) => {
			collectedCode = { ...collectedCode, ...getAdditionalCode(item, fragments) };
		});
	}

	return collectedCode;
};

const getAdditionalCodeAsString = (componentObj: any, fragments: any[]) => {
	const collectedCode = getAdditionalCode(componentObj, fragments);
	return Object.values(collectedCode).join('\n');
};

const otherImportsFromComponentObj = (json: any, fragments?: any[]) => {
	let imports = '';
	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type) {
			if (component.componentInfo.codeExport.react.otherImports) {
				imports += component.componentInfo.codeExport.react.otherImports({ json, fragments });
				break;
			}
		}
	}

	if (json.items) {
		imports += json.items.map((item: any) => otherImportsFromComponentObj(item, fragments)).join('\n');
	}

	// remove duplicate imports
	imports = sortedUniq(imports.split('\n')).join('\n');

	return imports;
};

const generateTemplate = (json: any, fragments: any[]) => {
	const carbonImports = jsonToCarbonImports(json);
	const carbonImportsString = carbonImports.reduce((string: string, curr: string) => (
		string += `${curr}, `
	), '');
	return {
		imports: `import { ${carbonImportsString} } from 'carbon-components-react';
			${otherImportsFromComponentObj(json, fragments)}`,
		template: jsonToTemplate(json, fragments),
		additionalCode: getAdditionalCodeAsString(json, fragments)
	};
};

const jsonToSharedComponents = (json: any, fragments: any[]) => {
	let sharedComponents: any = {};

	if (json.type === 'fragment') {
		const fragment = fragments.find(f => f.id === json.fragmentId);
		const fragmentTemplate = generateTemplate(fragment.data, fragments);

		sharedComponents[`src/shared/${tagNameFromFragment(fragment)}.js`] = format(`import React from 'react';
			${fragmentTemplate.imports};
			${hasFragmentStyleClasses(fragment) ? `
				import './${tagNameFromFragment(fragment)}.scss';
			` : ''}
			export const ${classNameFromFragment(fragment)} = ({state, setState}) => {
				const handleInputChange = (event) => {
					setState({...state, [event.target.name]: event.target.value});
				};

				${fragmentTemplate.additionalCode}

				return <>${fragmentTemplate.template}</>;
			};
		`, formatOptions);

		sharedComponents[`src/shared/${tagNameFromFragment(fragment)}.scss`] = format(
			`${getAllFragmentStyleClasses(fragment).map((styleClass: any) => `.${styleClass.id} {
				${styleClass.content}
			}`).join('\n')}`,
			formatOptionsCss
		);

		sharedComponents = {
			...sharedComponents,
			...jsonToSharedComponents(fragment.data, fragments)
		};
	}

	json.items?.forEach((item: any) => {
		sharedComponents = {
			...sharedComponents,
			...jsonToSharedComponents(item, fragments)
		};
	});

	return sharedComponents;
};

export const createReactApp = (fragment: any, fragments: any[]) => {
	const fragmentTemplate = generateTemplate(fragment.data, fragments);

	const sharedComponents = jsonToSharedComponents(fragment.data, fragments);

	const indexHtml = `<div id='root'></div>
`;
	const componentJs
		= `import React from 'react';
${fragmentTemplate.imports};
${hasFragmentStyleClasses(fragment) ? "\nimport './component.scss';\n" : ''}
export const FragmentComponent = ({state, setState}) => {
	const handleInputChange = (event) => {
		setState({...state, [event.target.name]: event.target.value});
	};

	${fragmentTemplate.additionalCode}

	return <>${fragmentTemplate.template}</>;
};
`;

	const componentScss = getAllFragmentStyleClasses(fragment).map((styleClass: any) => `.${styleClass.id} {
	${styleClass.content}
}`).join('\n');

	const indexJs
		= `import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import 'carbon-components/css/carbon-components.css';

import { FragmentComponent } from './component.js';

const App = () => {
	const [state, setState] = useState({});

	return (
		<div>
			<FragmentComponent state={state} setState={setState} />
		</div>
	);
}
ReactDOM.render(<App />, document.getElementById('root'));
`;
	const packageJson = {
		dependencies: {
			'carbon-components': '10.50.0',
			'carbon-icons': '7.0.7',
			'@carbon/icons-react': '10.15.0',
			'carbon-components-react': '7.50.0',
			react: '16.12.0',
			'react-dom': '16.12.0',
			'react-scripts': '3.0.1',
			'sass': '1.45.0',
			emotion: '10.0.27'
		}
	};

	return {
		'src/index.html': indexHtml,
		'src/index.js': format(indexJs, formatOptions),
		'src/component.js': format(componentJs, formatOptions),
		'src/component.scss': format(componentScss, formatOptionsCss),
		'package.json': packageJson,
		...sharedComponents
	};
};
