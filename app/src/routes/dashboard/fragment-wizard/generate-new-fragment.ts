import { getRandomId, CURRENT_MODEL_VERSION } from '@carbon-builder/sdk-react';

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
		if (fragment.allCssClasses) {
			addOrReplaceClasses(fragment.allCssClasses);
		}

		return {
			...fragment,
			id: fragment.id || fragmentID,
			lastModified: fragment.lastModified || new Date().toISOString()
		};
	}

	return {
		version: CURRENT_MODEL_VERSION,
		id: fragmentID,
		lastModified: new Date().toISOString(),
		title: fragmentName,
		data: fragment
	};
};
