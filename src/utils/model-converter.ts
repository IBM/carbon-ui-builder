export const CURRENT_MODEL_VERSION = '0.0.1';

/**
 * Model Value Changes
 * Includes the version and all the value changes that need to be updated
 *
 * Defined in the form of an array, if the model version is not `CURRENT_MODEL_VERSION`,
 * then the converter will update all values for specified component type and keys.
 *
 * Converter will progressively go through each version changes until the model version
 * is updated to `CURRENT_MODEL_VERSION`.
 */
const ModelValueChanges = [
	{
		version: '0.0.1',
		changes: [
			{ type: 'button', key: 'size', valueToChange: 'field', newValue: 'md' },
			{ type: 'button', key: 'size', valueToChange: 'default', newValue: 'lg' },
			{ type: 'search', key: 'size', valueToChange: 'lg', newValue: 'md' },
			{ type: 'search', key: 'size', valueToChange: 'xl', newValue: 'lg' },
			{ type: 'text-input', key: 'size', valueToChange: 'xl', newValue: 'lg' }
		]
	}
];

/**
 * Recursively goes through all fragment children and updates their values
 */
function updateModelValue(node: any, type: string, key: string, valueToChange: string, newValue: string) {
	// Check the item, whether it is a component that can render children or not
	if (node.type === type && node[key] === valueToChange) {
		node[key] = newValue;
	}

	// If component has items (children), then check the children to see if the values should change
	if (node.items) {
		node.items.forEach((element: any) => {
			updateModelValue(element, type, key, valueToChange, newValue);
		});
	}
}

export function updateModel(fragment: any) {
	const versionIndex = ModelValueChanges.findIndex(({ version }) => fragment?.version === version);
	if (versionIndex > -1 && versionIndex !== ModelValueChanges.length) {
		for (let i = versionIndex; i < ModelValueChanges.length; i++) {
			ModelValueChanges[i].changes.forEach(({ type, key, valueToChange, newValue }) => {
				updateModelValue(fragment.data, type, key, valueToChange, newValue);
			});
		}
	}
}
