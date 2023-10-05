export const slotsDisabled = {
	disable: (state: any) => ({
		...state,
		disabled: true
	}),
	enable: (state: any) => ({
		...state,
		disabled: false
	}),
	toggleDisabled: (state: any) => ({
		...state,
		disabled: !state.disabled
	}),
	disabled: 'boolean'
};

export const slotsHidden = {
	hide: (state: any) => ({
		...state,
		hidden: true
	}),
	show: (state: any) => ({
		...state,
		hidden: false
	}),
	toggleVisibility: (state: any) => ({
		...state,
		hidden: !state.hidden
	}),
	hidden: 'boolean'
};

export const commonSlots = {
	...slotsHidden
};
