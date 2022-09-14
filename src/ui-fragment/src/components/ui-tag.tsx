import React from 'react';
import { Tag } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface TagState {
	type: string;
	kind: string;
	title: string;
	id: string | number;
	size?: string;
	filter?: boolean;
	disabled?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UITag = ({ state }: {
	state: TagState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'tag') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Tag
	type={state.kind}
	size={state.size}
	disabled={state.disabled}
	filter={state.filter}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{state.title}
	</Tag>;
};
