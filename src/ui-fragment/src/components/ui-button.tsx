import React from 'react';
import { Button } from 'carbon-components-react';

export interface ButtonState {
	type: string;
	kind: string;
	text: string;
	id: string | number;
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

	return <Button kind={state.kind}>{state.text}</Button>;
};
