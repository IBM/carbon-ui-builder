export interface CssClasses {
	id: string;
	name: string;
	content: string;
}

export interface Action {
	source: string | number;
	signal: string;
	destination: string | number;
	slot: string;
	slot_param: string;
}
