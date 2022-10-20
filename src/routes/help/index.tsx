import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { css, cx } from 'emotion';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { useParams } from 'react-router-dom';

const helpContainerStyle = css`
	position: absolute;
	width: calc(100vw - 6rem);
	height: calc(100% - 3rem);
	top: 3rem;
	max-width: 100%;
	margin: 1rem 3rem;
`;

const helpIndex: any = {
	introduction: require('./introduction.md'),
	hotkeys: require('./hotkeys.md')
};

export const Help = () => {
	const params = useParams();
	const [markdownContent, setMarkdownContent] = useState('Loading!');

	useEffect(() => {
		axios.get(helpIndex[params.id || 'introduction']).then(response => setMarkdownContent(response.data));
	}, [params.id]);

	return <div className={cx(helpContainerStyle, 'markdown')}>
		<ReactMarkdown remarkPlugins={[gfm]}>{markdownContent}</ReactMarkdown>
	</div>;
};
