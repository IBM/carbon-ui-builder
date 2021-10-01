export const generateNewFragment = (
	fragment: any
) => {
	const fragmentID = `${Math.random().toString().slice(2)}${Math.random().toString().slice(2)}`;
	const fragmentName = 'New fragment';

	return {
		id: fragmentID,
		lastModified: new Date().toISOString(),
		title: fragmentName,
		data: fragment
	};
};
