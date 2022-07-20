import React from 'react';
import { ComboBox, FilterableMultiSelect } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface ComboBoxState {
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
	selectionFeedback?: string;
	direction?: string;
	size?: string;
	label?: string;
	helperText?: string;
	itemToString?: (item: any) => string;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIComboBox = ({ state }: {
	state: ComboBoxState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'combobox') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return state.isMulti
		? <FilterableMultiSelect
			placeholder={state.placeholder}
			id={state.id}
			items={state.listItems}
			light={state.light}
			invalid={state.invalid}
			invalidText={state.invalidText}
			isInline={state.isInline}
			warn={state.warn}
			warnText={state.warnText}
			disabled={state.disabled}
			selectionFeedback={state.selectionFeedback}
			direction={state.direction}
			size={state.size}
			label={state.label}
			helperText={state.helperText}
			itemToString={state.itemToString || ((item) => item.text || '')}
			className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		: <ComboBox
			placeholder={state.placeholder}
			id={state.id}
			items={state.listItems}
			light={state.light}
			invalid={state.invalid}
			invalidText={state.invalidText}
			isInline={state.isInline}
			warn={state.warn}
			warnText={state.warnText}
			disabled={state.disabled}
			selectionFeedback={state.selectionFeedback}
			direction={state.direction}
			size={state.size}
			label={state.label}
			helperText={state.helperText}
			itemToString={state.itemToString || ((item) => item.text || '')}
			className={state.cssClasses?.map((cc: any) => cc.id).join(' ')} />;
};
