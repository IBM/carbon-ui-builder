import { getRandomId } from '../../../sdk/src/tools';

export const generateNewFragment = (fragment: any, styleClasses: any[], setStyleClasses: (styleClasses: any[]) => void) => {
	const addOrReplaceClasses = (newClasses: any[]) => {
		const newStyleClasses = [...styleClasses];

		newClasses.forEach((newClass: any) => {
			const foundClassIndex = styleClasses.findIndex((sc: any) => newClass.id === sc.id);

			if (foundClassIndex < 0) {
				newStyleClasses.push(newClass);
			} else {
				newStyleClasses[foundClassIndex] = newClass;
			}
		});

		setStyleClasses(newStyleClasses);
	};
	const fragmentID = getRandomId();
	const fragmentName = 'New fragment';

	if (fragment.data) {
		addOrReplaceClasses(fragment.allCssClasses);

		return {
			...fragment,
			id: fragment.id || fragmentID,
			lastModified: fragment.lastModified || new Date().toISOString()
		};
	}

	return {
		id: fragmentID,
		lastModified: new Date().toISOString(),
		title: fragmentName,
		data: fragment
	};
};
