import React, { useState } from 'react';
import Handlebars from 'handlebars';
import Editor from '@monaco-editor/react';

export const CustomComponentsCollectionEditor = ({ collection, setCollection }: any) => {
	const [jsonParseError, setJsonParseError] = useState('');
	const [model, _setModel] = useState(JSON.stringify(collection, null, '\t'));

	const setModel = (modelString: string) => {
		_setModel(modelString);
		try {
			if (modelString) {
				const parsedModel = JSON.parse(modelString);
				parsedModel.components.forEach((component: any, index: number) => {
					// try parsing template to check for compile errors
					try {
						(Handlebars.compile(component.htmlPreview))((component.defaultInputs));
					} catch (e) {
						throw new Error(`Component ${index} [${component?.type}] htmlPreview` + e);
					}
				});
				setCollection(parsedModel);
			}

			setJsonParseError('');
		} catch (e) {
			setJsonParseError((e as any).toString());
		}
	};

	const handleEditorChange = (value: any, _event: any) => {
		setModel(value);
	};

	return <>
		{
			jsonParseError
			&& <>
				Not saved until the error is corrected:
				<code style={{ color: '#a00', marginBottom: '10pt', width: '100%' }}>
					<pre>{jsonParseError}</pre>
				</code>
			</>
		}
		<Editor
			height='calc(100vh - 340px)'
			language='json'
			value={model}
			onChange={handleEditorChange}
		/>
	</>;
};
