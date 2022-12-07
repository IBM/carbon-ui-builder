import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { filenameToLanguage } from '../routes/edit/tools';
import { UIFragment } from '../ui-fragment/src/ui-fragment';
import { css, cx } from 'emotion';

const markdownContainerStyle = css`
	margin: 1rem 3rem;
`;

<<<<<<< HEAD
const centerStyle = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

=======
>>>>>>> ae485acc11cd7df30f018282725bc2ada4dd5d90
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
		const suffix = chunks[chunks.length - 1].toLowerCase();

		// if file is an image
		if (
			suffix === 'jpg' ||
			suffix === 'jpeg' ||
			suffix === 'png' ||
			suffix === 'gif' ||
			suffix === 'svg' ||
			suffix === 'ico'
		) {
			return <img className='center' src={`data:image/${suffix};base64,${fileContentBase64}`} />;
		}

		if (suffix === 'md') {
			return <div className={cx(markdownContainerStyle, 'markdown')}>
				<ReactMarkdown remarkPlugins={[gfm]}>{fileContent}</ReactMarkdown>
			</div>;
		}

		// show non-image content in an editor
		return <Editor
			height={editorHeight || '100vh'}
			language={filenameToLanguage(path || '')}
			value={fileContent}
			options={{ readOnly: true }}
		/>;
	}

	return <UIFragment state={interactiveFragmentState} setState={(state) => setInteractiveFragmentState(state)} />;
};
