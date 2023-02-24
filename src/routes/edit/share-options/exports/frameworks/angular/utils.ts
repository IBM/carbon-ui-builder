import { Options } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import { allComponents } from '../../../../../../fragment-components';
import { addIfNotExist } from '../../../../../../ui-fragment/src/utils';
import {
	nameStringToVariableString,
	tagNameFromFragment
} from '../../../../../../utils/fragment-tools';
import { signalType, slotInfo, slotProp } from '../utils';

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

export const signalAngularEvent: Record<signalType, Array<string>> = {
	click: ['click'],
	hover: ['mouseenter', 'mouseleave'],
	focus: ['focus', 'focusout']
};

export const slotAngularEvent: Record<slotProp, slotInfo> = {
	isVisible: {
		type: 'boolean',
		action: 'disabled'
	}
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

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularInputsFromJson(item)).join('') : ''}
	`;
};

export const getAngularOutputsFromJson = (json: any, signals: any, slots: any): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.outputs({ json }) || '';
			}
		}
		return '';
	};

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularOutputsFromJson(item, signals, slots)).join('') : ''}
	`;
};
export const jsonToTemplate = (json: any, signals: any, slots: any, fragments: any[]) => {
	if (typeof json === 'string' || !json) {
		return json;
	}

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type && !component.componentInfo.codeExport.angular.isNotDirectExport) {
			return component.componentInfo.codeExport.angular.code({ json, signals, slots, jsonToTemplate, fragments });
		}
	}

	if (json.items) {
		return json.items.map((item: any) => jsonToTemplate(item, signals, slots, fragments)).join('\n');
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

export const getIdContextNameMap = (json: any, itemIds: Set<any>, map: any) => {
	if (typeof json === 'string' || !json) {
		return json;
	}

	if (json.items) {
		json.items.forEach((item: any) => {
			if (itemIds.has(item.id)) {
				map[item.id] = item.codeContext?.name;
			}
			map = getIdContextNameMap(item, itemIds, map);
		});
	}

	return map;
};

export const getSignalEventActions = (signalEvent: any, slots: any) => {
	let res = '';
	Object.keys(signalEvent).forEach((destId) => {
		signalEvent[destId].forEach((slotInfo: any) => {
			const prop = slotInfo.property.charAt(0).toUpperCase() + slotInfo.property.slice(1);
			const name = nameStringToVariableString(slots[destId].contextName);
			res += `${name}${prop} = `;
			if (slotAngularEvent[slotInfo.property as slotProp].type === 'boolean') {
				res += `!${name}${prop};`;
			} else { // In future will need to handle different slot_param types
				res += `${name}${prop}`;
			}
		});
	});
	return res;
};

export const getVariables = (slots: any) => {
	let code = '';

	Object.keys(slots).forEach(id => {
		if (slots[id].events) {
			Object.keys(slots[id].events).forEach((event) => {
				const name = nameStringToVariableString(slots[id].contextName);
				const prop = event.charAt(0).toUpperCase() + event.slice(1);
				code += `${name}${prop} = ${slots[id].events[event]};`;
			});
		}
	});
	return code;
};

export const getItemCode = (signals: any, slots: any, id: string, contextName: string) => {
	let codeForActions = '';
	if (id) {
		if (signals[id] && signals[id].events) {
			// This sends the signal to disable
			Object.keys(signals[id].events).forEach((eventName) => {
				const actions = signalAngularEvent[eventName as signalType];
				const name = nameStringToVariableString(contextName);
				actions.forEach(event => {
					codeForActions += `(${event}) = '`;

					if (eventName === 'click') {
						codeForActions += `${name}Clicked.emit();`;
					}

					codeForActions += getSignalEventActions(
						signals[id].events[eventName],
						slots
					);
					codeForActions += '\'';
				});
			});
		}

		if (slots[id] && slots[id].events) {
			Object.keys(slots[id].events).forEach((eventName) => {
				const name = nameStringToVariableString(contextName);
				const prop = eventName.charAt(0).toUpperCase() + eventName.slice(1);
				codeForActions += `[${slotAngularEvent[eventName as slotProp].action}] = `;

				if (slotAngularEvent[eventName as slotProp].type === 'boolean') {
					codeForActions += `'!${name}${prop}'`;
				} else { // In future will need to handle different slot_param types
					codeForActions += `'${name}${prop}'`;
				}
			});
		}

		// Adds click if it hasent already
		if (!signals[id] || !signals[id]?.events['click']) {
			codeForActions += `(click)='${nameStringToVariableString(contextName)}Clicked.emit();'`;
		}
	}
	return codeForActions;
};
