import { getParameters } from 'codesandbox/lib/api/define';

export const createFragmentSandbox = (fragmentTemplate: any) => {
	const files: Record<string, any> = {};

	Object.keys(fragmentTemplate)
		.forEach((filePath: string) => files[filePath] = { content: fragmentTemplate[filePath] });

	return getParameters({ files });
};
