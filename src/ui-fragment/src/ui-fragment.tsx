import { renderComponents } from './utils';

export interface UIFragmentProps {
	state: any;
	setState: (state: any) => void;
}

export const UIFragment = ({ state, setState }: UIFragmentProps) => {
	return renderComponents(state, setState, setState);
};
