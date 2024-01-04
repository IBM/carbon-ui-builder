import React, { useContext, useState } from 'react';
import { Modal } from '@carbon/react';
import Editor from '@monaco-editor/react';
import Handlebars from 'handlebars';
import { GlobalStateContext, ModalContext } from '../context';

export const CustomComponentsModal = () => {
	const { customComponentsModal, hideCustomComponentsModal } = useContext(ModalContext);
	const { customComponentsCollections, setCustomComponentsCollections } = useContext(GlobalStateContext);
	const [jsonParseError, setJsonParseError] = useState('');
	const [model, _setModel] = useState(JSON.stringify(customComponentsCollections ? customComponentsCollections[0] : {}, null, '\t'));

	const setModel = (modelString: string) => {
		_setModel(modelString);
		try {
			if (modelString) {
				// TODO set exact modelCollection based on name instead
				const parsedModel = JSON.parse(modelString);
				parsedModel.components.forEach((component: any, index: number) => {
					// try parsing template to check for compile errors
					try {
						(Handlebars.compile(component.htmlPreview))((component.defaultInputs));
					} catch (e) {
						throw new Error(`Component ${index} [${component?.type}] htmlPreview` + e);
					}
				});
				setCustomComponentsCollections([parsedModel]);
			}

			setJsonParseError('');
		} catch (e) {
			setJsonParseError((e as any).toString());
		}
	};

	const handleEditorChange = (value: any, _event: any) => {
		setModel(value);
	};

	return <Modal
	size='lg'
	open={customComponentsModal.isVisible}
	onRequestClose={hideCustomComponentsModal}
	modalHeading='Custom components (Experimental)'
	primaryButtonText='Done'
	onRequestSubmit={() => {
		hideCustomComponentsModal();
	}}>
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
			height='calc(100vh - 32px)'
			language='json'
			value={model}
			onChange={handleEditorChange}
		/>
	</Modal>;
};
