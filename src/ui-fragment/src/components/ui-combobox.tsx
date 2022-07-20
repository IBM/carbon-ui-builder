import React from 'react';
import { ComboBox, FilterableMultiSelect } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface ComboBoxState {
	type: string;
	placeholder: string;
	id: string | number;
	selectedItem?: any;
	listItems?: any[];
	light?: boolean;
	invalid?: boolean;
	invalidText?: string;
	isMulti?: boolean;
	isInline?: boolean;
	warn?: boolean;
	warnText?: string;
	disabled?: boolean;
	selectionFeedback?: string;
	direction?: string;
	size?: string;
	label?: string;
	hideLabel?: boolean;
	helperText?: string;
	itemToString?: (item: any) => string;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIComboBox = ({ state, setState }: {
	state: ComboBoxState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'combobox') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	const ComboOrMulti = state.isMulti ? FilterableMultiSelect : ComboBox;

	return <ComboOrMulti
		{...state.isMulti ? {
			type: state.isInline ? 'inline' : 'default',
			hideLabel: state.hideLabel,
			selectionFeedback: state.selectionFeedback
		} : {}}
		placeholder={state.placeholder}
		id={state.id}
		items={state.listItems}
		light={state.light}
		invalid={state.invalid}
		invalidText={state.invalidText}
		warn={state.warn}
		warnText={state.warnText}
		disabled={state.disabled}
		direction={state.direction}
		size={state.size}
		label={state.label}
		selectedItem={state.selectedItem}
		helperText={state.helperText}
		itemToString={state.itemToString || ((item) => item.text || '')}
		onChange={(selectedItem: any) => setState({
			...state,
			selectedItem: state.listItems?.find((item) => item.text === selectedItem.text)
		})}
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
