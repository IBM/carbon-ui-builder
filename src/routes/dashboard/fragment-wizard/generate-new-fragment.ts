import { getRandomId } from '../../../utils/fragment-tools';

export const generateNewFragment = (fragment: any) => {
	const fragmentID = getRandomId();
	const fragmentName = 'New fragment';

	return {
		id: fragmentID,
		lastModified: new Date().toISOString(),
		title: fragmentName,
		data: fragment
	};
};
