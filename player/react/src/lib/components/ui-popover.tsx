import React from 'react';
import {
	Popover,
    PopoverContent
} from '@carbon/react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots } from '../common-slots';

export interface PopoverState {
	type: string;
	id: string | number;
    isOpen: boolean;
    isTabTip: boolean;
    isShowCaret: boolean;
    isDropShadow: boolean;
    isHighContrast: boolean;
    align: string;
    text: string;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
    style?: any;
}

export const type = 'popover';

export const slots = {
	...commonSlots,
    id: 'string',
    type: 'string',
	text: 'string',
	align: 'string',
    open: 'boolean',
    isOpen: (state : PopoverState) => ({
        ...state,
        isOpen: true
    }),
    isNotOpen: (state : PopoverState) => ({
        ...state,
        isOpen: false
    }),
    toggleOpen: (state : PopoverState) => ({
        ...state,
        isOpen: !state.isOpen
    }),
    tabTip: 'boolean',
    isTabTip: (state : PopoverState) => ({
        ...state,
        isTabTip: true
    }),
    isNotTabTip: (state : PopoverState) => ({
        ...state,
        isTabTip: false
    }),
    toggleTabTip: (state : PopoverState) => ({
        ...state,
        isTabTip: !state.isTabTip
    }),
    showCaret: 'boolean',
    isShowCaret: (state : PopoverState) => ({
        ...state,
        isShowCaret: true
    }),
    isNotShowCaret: (state : PopoverState) => ({
        ...state,
        isShowCaret: false
    }),
    toggleShowCaret: (state : PopoverState) => ({
        ...state,
        isShowCaret: !state.isShowCaret
    }),
    dropShadow: 'boolean',
    isDropShadow: (state : PopoverState) => ({
        ...state,
        isDropShadow: true
    }),
    isNotDropShadow: (state : PopoverState) => ({
        ...state,
        isDropShadow: false
    }),
    toggleDropShadow: (state : PopoverState) => ({
        ...state,
        isDropShadow: !state.isDropShadow
    }),
    highContrast: 'boolean',
    isHighContrast: (state : PopoverState) => ({
        ...state,
        isHighContrast: true
    }),
    isNotHighContrast: (state : PopoverState) => ({
        ...state,
        isHighContrast: false
    }),
    toggleHighContrast: (state : PopoverState) => ({
        ...state,
        isHighContrast: !state.isHighContrast
    })
};


export const UIPopover = ({ state, setState }: {
	state: PopoverState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'popover') {
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

	return <Popover 
        open={state.isOpen ? state.isOpen : false}
        align={state.align ? state.align : (state.isTabTip ? 'bottom-start' : 'bottom')}
        caret={state.isShowCaret ? state.isShowCaret : (state.isTabTip ? false : true)}
        dropShadow={state.isDropShadow ? state.isDropShadow : true}
        highContrast={state.isHighContrast ? state.isHighContrast : true}
        isTabTip={state.isTabTip ? state.isTabTip : false}>
            <PopoverContent>
                ${ state.text }
            </PopoverContent>
    </Popover>;
};
