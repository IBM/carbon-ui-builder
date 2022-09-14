import React from 'react';
import { css } from 'emotion';
import { getAllComponentStyleClasses, renderComponents } from './utils';

export interface UIFragmentProps {
	state: any;
	setState: (state: any) => void;
}

export const UIFragment = ({ state, setState }: UIFragmentProps) => {
	const styles = css`${
		Object.values(getAllComponentStyleClasses(state, [])).map((styleClass: any) => `.${styleClass.id} {
			${styleClass.content}
		}`)
	}`;

	return <div className={styles}>
		{ renderComponents(state, setState, setState) }
	</div>;
};
