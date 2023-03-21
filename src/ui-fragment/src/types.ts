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
	slot_param: string | number | boolean;
}
