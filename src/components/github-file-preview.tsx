import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { filenameToLanguage } from '../routes/edit/tools';
import { UIFragment } from '../ui-fragment/src/ui-fragment';

export const GithubFilePreview = ({
	path,
	editorHeight,
	fragmentState,
	fileContent,
	fileContentBase64
}: any) => {
	const [interactiveFragmentState, setInteractiveFragmentState] = useState(fragmentState);

	useEffect(() => {
		setInteractiveFragmentState(fragmentState);
	}, [fragmentState]);

	if (!fragmentState && !fileContent) {
		return <div>Loading...</div>;
	}

	// fileContent is set when the content we fetched isn't parsed as fragment json
	if (fileContent) {
		const chunks = (path || '').split('.');
		const suffix = chunks[chunks.length - 1];

		// if file is an image
		if (
			suffix === 'jpg' ||
			suffix === 'jpeg' ||
			suffix === 'png' ||
			suffix === 'gif' ||
			suffix === 'svg' ||
			suffix === 'ico'
		) {
			return <img src={`data:image/${suffix};base64,${fileContentBase64}`} />;
		}

		// show non-image content in an editor
		return <Editor
			height={editorHeight || '100vh'}
			language={filenameToLanguage(path || '')}
			value={fileContent}
		/>;
	}

	return <UIFragment state={interactiveFragmentState} setState={(state) => setInteractiveFragmentState(state)} />;
};
