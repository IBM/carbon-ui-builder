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
