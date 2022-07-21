import React from 'react';
import { Button } from 'carbon-components-react';
import { CssClasses } from '../types';

export interface ButtonState {
	type: string;
	kind: string;
	text: string;
	id: string | number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const UIButton = ({ state }: {
	state: ButtonState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'button') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <Button
	kind={state.kind}
	name={state.codeContext?.name}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{state.text}
	</Button>;
};
