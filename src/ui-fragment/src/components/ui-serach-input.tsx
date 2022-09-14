import React from 'react';
import { Search } from 'carbon-components-react';
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

	return <Search
		id={state.codeContext?.name}
		name={name}
		value={state.value}
		placeholder={state.placeholder}
		labelText={state.label}
		autoComplete={state.autoComplete || 'off'}
		closeButtonLabelText={state.closeButtonLabelText || 'Clear search input'}
		defaultValue={state.defaultValue}
		disabled={state.disabled}
		light={state.light}
		role={state.role || 'searchbox'}
		onChange={(event: any) => setState({ ...state, value: event.imaginaryTarget.value })}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
