import { format as formatPrettier, Options } from 'prettier';

export const format = (source: string, options?: Options | undefined) => {
	// we're catching and ignorring errors so live editing doesn't throw errors
	try {
		return formatPrettier(source, options);
	} catch (_) {
		return source;
	}
};

export type signalType = 'click' | 'hover' | 'focus';
export type slotProp = 'isVisible';

export interface slotInfo {
	type: string;
	action: string;
}

export interface action {
	source: string;
	signal: signalType;
	destination: string;
	slot: string;
	slot_param: string;
}
