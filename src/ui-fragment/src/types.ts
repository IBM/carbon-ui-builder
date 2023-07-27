import { signalType } from '../../routes/edit/share-options/exports/frameworks/utils';

export interface CssClasses {
	id: string;
	name: string;
	content: string;
}

export interface Action {
	source: number;
	signal: signalType;
	destination: number;
	slot: string;
	slotParam: string | number | boolean;
}

export type SendSignal = (id: number | string, signal: string, value?: any[], newSenderState?: any) => void;
