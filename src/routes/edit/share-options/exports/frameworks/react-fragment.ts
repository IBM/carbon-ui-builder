import { format as formatPrettier, Options } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserCss from 'prettier/parser-postcss';
import { allComponents } from '../../../../../fragment-components';
import { getAllFragmentStyleClasses, hasFragmentStyleClasses } from '../../../../../utils/fragment-tools';

const format = (source: string, options?: Options | undefined) => {
	// we're catching and ignorring errors so live editing doesn't throw errors
	try {
		return formatPrettier(source, options);
	} catch (_) {
		return source;
	}
};

const addIfNotExist = (arr: any[], items: any[]) => {
    items.forEach(item => {
        if (!arr.includes(item)) {
            arr.push(item);
        }
    });
    return arr;
}

const jsonToImports = (json: any) => {
    const imports: any[] = [];

	for (let [key, component] of Object.entries(allComponents)) {
		if (json.type === key) {
			addIfNotExist(imports, component.componentInfo.codeExport.react.imports);
		}
	}

	if (json.items) {
        json.items.forEach((item: any) => {
            addIfNotExist(imports, jsonToImports(item));
        });
	}

    return imports;
};

export const jsonToTemplate = (json: any) => {
    if (typeof json === "string" || !json) {
        return json;
    }

	for (let [key, component] of Object.entries(allComponents)) {
		if (json.type === key && !component.componentInfo.codeExport.react.isNotDirectExport) {
			return component.componentInfo.codeExport.react.code({json, jsonToTemplate});
		}
	}

    if (json.items) {
        return json.items.map((item: any) => jsonToTemplate(item)).join('\n');
    }
};


const generateTemplate = (json: any) => {
	const carbonImports = jsonToImports(json);
	const carbonImportsString = carbonImports.reduce((string: string, curr: string) => (
		string += `${curr}, `
	), '');
	return {
		imports: `import { ${carbonImportsString} } from 'carbon-components-react'`,
		template: jsonToTemplate(json)
	};
};

export const createReactApp = (fragment: any) => {
	const fragmentTemplate = generateTemplate(fragment.data);
	const formatOptions: Options = {
		plugins: [parserBabel],
		trailingComma: 'none',
		useTabs: true
	};
	const formatOptionsCss: Options = {
		parser: 'css',
		plugins: [parserCss]
	};

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
		'package.json': packageJson
	};
};
