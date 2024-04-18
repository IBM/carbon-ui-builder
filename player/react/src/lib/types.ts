export interface CssClasses {
	id: string;
	name: string;
	content: string;
}

export interface Action {
	source: number;
	signal: string;
	destination: number;
	slot: string;
	slotParam: string | number | boolean;
}

export type SendSignal = (id: number | string, signal: string, value?: any[], newSenderState?: any) => void;
