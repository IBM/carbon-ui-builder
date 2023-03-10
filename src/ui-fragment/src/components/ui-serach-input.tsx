import React from 'react';
import { Search, ExpandableSearch } from 'carbon-components-react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';

export interface SearchState {
	type: string;
	id: string | number;
	label?: string;
	placeholder?: string;
	autocomplete?: string;
	value?: string;
	closeButtonLabelText?: string;
	defaultValue?: string;
	disabled?: string | boolean;
	light?: boolean;
	role?: string;
	expandable: boolean;
	inputSize: string;
	searchType: string;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const UISearchInput = ({ state, setState, name }: {
	state: SearchState;
	name?: string;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'search') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	let cssClasses = state.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (state.style) {
		if (cssClasses.length > 0) {
			cssClasses += ' ';
		}
		cssClasses += stringToCssClassName(state.codeContext.name);
	}

	return state.expandable
		? <ExpandableSearch
			className={cssClasses}
			size={state.inputSize}
			disabled={state.disabled}
			autoComplete={state.autocomplete}
			placeholder={state.placeholder}
			light={state.light}
			labelText={state.label}
			defaultValue={state.defaultValue}
			closeButtonLabelText={state.closeButtonLabelText}
			id={state.id}
			role={state.role}
			type={state.searchType}
			onChange={(event: any) => setState({ ...state, value: event.imaginaryTarget.value })} />
		: <Search
		name={name}
		size={state.inputSize}
		labelText={state.label}
		placeholder={state.placeholder}
		className={cssClasses}
		id={state.codeContext?.name}
		autoComplete={state.autocomplete}
		closeButtonLabelText={state.closeButtonLabelText}
		defaultValue={state.defaultValue}
		disabled={state.disabled}
		light={state.light}
		role={state.role}
		type={state.searchType}
		onChange={(event: any) => setState({ ...state, value: event.imaginaryTarget.value })} />;
};
