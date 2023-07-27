import { useContext } from 'react';
import { GlobalStateContext } from '../../../../../../context';
import { getAllFragmentStyleClasses } from '../../../../../../ui-fragment/src/utils';
import { hasFragmentStyleClasses } from '../../../../../../utils/fragment-tools';
import { format } from '../utils';
import {
	formatOptions,
	formatOptionsCss,
	getAdditionalCodeAsString,
	jsonToCarbonImports,
	jsonToTemplate,
	otherImportsFromComponentObj,
	signalReactEvent,
	getIdContextNameMap
} from './utils';
import { classNameFromFragment, tagNameFromFragment } from '../../../../../../sdk/src/tools';
import { Action } from '../../../../../../ui-fragment/src/types';

const generateTemplate = (json: any, fragments: any[]) => {
	const carbonImports = jsonToCarbonImports(json);
	const carbonImportsString = carbonImports.reduce((string: string, curr: string) => (
		string += `${curr}, `
	), '');
	const signals: any = {};
	const slots: any = {};
	if (json.actions) {
		json.actions.forEach((action: Action) => {
			const itemIdsWithActions = new Set(json.actions.map((action: Action) => [action.source, action.destination]).flat());
			const idContextNameMap = getIdContextNameMap(json, itemIdsWithActions, {});
			const eventName = signalReactEvent[action.signal];
			if (!signals[idContextNameMap[action.source]]) {
				signals[idContextNameMap[action.source]] = {};
			}
			if (!signals[idContextNameMap[action.source]][eventName]) {
				signals[idContextNameMap[action.source]][eventName] = {};
			}
			if (!signals[idContextNameMap[action.source]][eventName][idContextNameMap[action.destination]]) {
				signals[idContextNameMap[action.source]][eventName][idContextNameMap[action.destination]] = [];
			}
			signals[idContextNameMap[action.source]][eventName][idContextNameMap[action.destination]].push({
				property: action.slot,
				value: JSON.parse(action.slotParam.toString())
			});

			if (!slots[idContextNameMap[action.destination]]) {
				slots[idContextNameMap[action.destination]] = new Set<string>();
			}
			slots[idContextNameMap[action.destination]].add(action.slot);
		});
	}
	return {
		imports: `import { ${carbonImportsString} } from 'carbon-components-react';
			${otherImportsFromComponentObj(json, fragments)}`,
		template: jsonToTemplate(json, signals, slots, fragments),
		additionalCode: getAdditionalCodeAsString(json, fragments)
	};
};

const jsonToSharedComponents = (json: any, fragments: any[]) => {
	let sharedComponents: any = {};
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { styleClasses: globalStyleClasses } = useContext(GlobalStateContext);

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
			`${getAllFragmentStyleClasses(fragment, [], globalStyleClasses).map((styleClass: any) => `.${styleClass.id} {
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
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { styleClasses: globalStyleClasses } = useContext(GlobalStateContext);
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

	const componentScss = getAllFragmentStyleClasses(fragment, [], globalStyleClasses).map((styleClass: any) => {
		if (!styleClass.content || !styleClass.content.trim()) {
			return null;
		}

		return `.${styleClass.id} {
			${styleClass.content}
		}`;
	}).join('\n');

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
			'carbon-components': '10.58.0',
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
