import React from 'react';
import {
	Select,
	SelectItem,
	SelectItemGroup
} from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface SelectState {
	id?: string;
	type?: string;
	inline?: boolean;
	invalid?: boolean;
	disabled?: boolean;
	warn?: boolean;
	labelText: string;
	invalidText?: string;
	warnText?: string;
	size?: string;
	defaultValue: string;
	helperText?: string;
	items: [];
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
		href?: string;
	};
}

export const type = 'select';

export const signals = ['click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	labelText: 'string',
	defaultValue: 'string'
};

export const UISelect = ({ state, sendSignal }: {
	state: SelectState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {

	if (state.type !== 'select') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Select
		id={state.id}
		defaultValue={state.defaultValue}
		helperText={state.helperText}
		invalidText={state.invalidText}
		warn={state.warn}
		warnText={state.warnText}
		size={state.size}
		labelText={state.labelText}
		inline={state.inline}
		invalid={state.invalid}
		disabled={state.disabled}>
		{
			state.items.map((step: any) =>
				step.items && step.items.length > 0 ?
				<SelectItemGroup
					key={step.id}
					label={step.label}
					disabled={step.disabled}>
						{
							step.items.map((child: any) => <SelectItem
									key={step.id}
									onClick={() => sendSignal(step.id, 'click')}
									text={child.text}
									value={child.value}
									disabled={child.disabled}
									hidden={child.hidden}
								/>)
						}
				</SelectItemGroup>
					:
				<SelectItem
					onClick={() => sendSignal(step.id, 'click')}
					key={step.id}
					text={step.text}
					value={step.value}
					disabled={step.disabled}
					hidden={step.hidden} />
			)
		}
	</Select>;
};
