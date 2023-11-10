import React from 'react';
import { ComboBox, FilterableMultiSelect } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface ComboBoxState {
	type: string;
	placeholder: string;
	id: string | number;
	hidden?: boolean;
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
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'combobox';

export const signals = ['select'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	markValid: (state: any) => ({
		...state,
		invalid: false
	}),
	markInvalid: (state: any) => ({
		...state,
		invalid: true
	}),
	toggleInvalid: (state: any) => ({
		...state,
		invalid: !state.invalid
	}),
	enableMulti: (state: any) => ({
		...state,
		isMulti: true
	}),
	disableMulti: (state: any) => ({
		...state,
		isMulti: false
	}),
	toggleMulti: (state: any) => ({
		...state,
		isMulti: !state.isMulti
	}),
	enableInline: (state: any) => ({
		...state,
		isInline: true
	}),
	disableInline: (state: any) => ({
		...state,
		isInline: false
	}),
	toggleInline: (state: any) => ({
		...state,
		isInline: !state.isInline
	}),
	activateWarning: (state: any) => ({
		...state,
		warn: true
	}),
	deactivateWarning: (state: any) => ({
		...state,
		warn: false
	}),
	toggleWarning: (state: any) => ({
		...state,
		warn: !state.warn
	}),
	invalid: 'boolean',
	isMulti: 'boolean',
	isInline: 'boolean',
	warn: 'boolean',
	warnText: 'string',
	label: 'string',
	helperText: 'string',
	size: 'string'
};

export const UIComboBox = ({ state, sendSignal }: {
	state: ComboBoxState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'combobox') {
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
		titleText={state.label}
		selectedItem={state.selectedItem}
		helperText={state.helperText}
		itemToString={state.itemToString || ((item) => item?.text || '')}
		onChange={(selectedItem: any) => sendSignal(
			state.id,
			'select',
			[state.listItems?.find((item) => item.text === selectedItem.text).selectedItem],
			{
				...state,
				selectedItem: state.listItems?.find((item) => item.text === selectedItem.text)
			})
		}
		className={cssClasses} />;
};
