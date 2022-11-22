import React from 'react';
import { Dropdown, MultiSelect } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface DropdownState {
	type: string;
	placeholder: string;
	id: string | number;
	listItems?: any[];
	light?: boolean;
	invalid?: boolean;
	invalidText?: string;
	isMulti?: boolean;
	isInline?: boolean;
	warn?: boolean;
	warnText?: string;
	disabled?: boolean;
	hideLabel?: boolean;
	direction?: string;
	size?: string;
	label?: string;
	selectedItem?: any;
	helperText?: string;
	itemToString?: (item: any) => string;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIDropdown = ({ state, setState }: {
	state: DropdownState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'dropdown') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	const DropdownOrMulti = state.isMulti ? MultiSelect : Dropdown;

	return <DropdownOrMulti
		id={state.codeContext?.name}
		items={state.listItems}
		label={state.placeholder}
		selectedItem={state.selectedItem}
		titleText={state.label}
		size={state.size}
		light={state.light}
		disabled={state.disabled}
		helperText={state.helperText}
		type={state.isInline ? 'inline' : undefined}
		warn={state.warn}
		warnText={state.warnText}
		hideLabel={state.hideLabel}
		invalid={state.invalid}
		invalidText={state.invalidText}
		direction={state.direction}
		itemToString={state.itemToString || ((item) => item.text || '')}
		onChange={(selectedItem: any) => setState({
			...state,
			selectedItem: state.listItems?.find((item) => item.text === selectedItem.text)
		})}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
