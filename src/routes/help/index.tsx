import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { css } from 'emotion';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { useParams } from 'react-router-dom';

const helpContainerStyle = css`
	position: absolute;
	width: 100vw;
	height: calc(100% - 3rem);
	top: 3rem;
	max-width: 100%;
	margin: 1rem 3rem;

	h1 {
		margin-bottom: 2rem;
	}

	h2, h3 {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	table {
		thead {
			font-weight: bold;
			font-size: 150%;
			text-align: left;
		}
		tr, th, td {
			padding 1rem;
		}
		tr {
			border-bottom: 1px solid #888;
		}
	}
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

	return <div className={helpContainerStyle}>
		<ReactMarkdown remarkPlugins={[gfm]}>{markdownContent}</ReactMarkdown>
	</div>;
};
