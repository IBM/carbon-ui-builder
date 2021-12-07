import LZString from 'lz-string';

export const createFragmentSandbox = (fragmentTemplate: any) => {
	const files: Record<string, any> = {};

	Object.keys(fragmentTemplate)
		.forEach((filePath: string) => files[filePath] = { content: fragmentTemplate[filePath] });

	return LZString.compressToBase64(JSON.stringify({ files }))
		.replace(/\+/g, `-`) // '+' -> '-'
		.replace(/\//g, `_`) // '/' -> '_'
		.replace(/=+$/, ``); // Remove ending '='
};
