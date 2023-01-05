import { format as formatPrettier, Options } from 'prettier';

export const format = (source: string, options?: Options | undefined) => {
	// we're catching and ignorring errors so live editing doesn't throw errors
	try {
		return formatPrettier(source, options);
	} catch (_) {
		return source;
	}
};

export const addIfNotExist = (arr: any[], items: any[]) => {
	items.forEach(item => {
		if (!arr.includes(item)) {
			arr.push(item);
		}
	});
	return arr;
};
