import React from 'react';
import { Search, ExpandableSearch } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface SearchState {
	type: string;
	id: string | number;
	label?: string;
	placeholder?: string;
	autoComplete?: string;
	value?: string;
	closeButtonLabelText?: string;
	defaultValue?: string;
	disabled?: boolean;
	light?: boolean;
	role?: string;
	expandable: boolean;
	inputSize: string;
	searchType: string;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UISearchInput = ({ state, setState, name }: {
	state: SearchState;
	name?: string;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'search') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return state.expandable
		? <ExpandableSearch
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
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
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
