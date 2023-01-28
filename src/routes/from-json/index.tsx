import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Button } from 'carbon-components-react';
import { Edit32, Copy16 } from '@carbon/icons-react';
import { GlobalStateContext } from '../../context';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';
import { generateNewFragment } from '../dashboard/fragment-wizard/generate-new-fragment';
import { css } from 'emotion';

const blockContainerStyle = css`
	border: 1px solid lightgrey;
	margin-bottom: 2rem;
	margin-top: 1rem;
`;

const pageContainerStyle = css`
	margin: 4rem 3rem 1rem;

	p {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
`;

const contentContainerStyle = css`
	margin-top: 1rem;
	margin-bottom: 2rem;
	ul {
		list-style: disc;
		margin-left: 2rem;

		ul {
			list-style: circle;
		}
	}
`;

const copyToClipboard = (codeString: string | undefined) => {
	navigator.clipboard.writeText(codeString || '');
};

export const FromJson = () => {
	const { styleClasses, setStyleClasses, addFragment } = useContext(GlobalStateContext);
	const [state, setState] = useState({
		fragmentState: {} as any,
		parseSucceeded: true
	});

	const navigate = useNavigate();
	const params = useParams();

	const setFragmentState = (fragmentState: any) => {
		setState({
			...state,
			fragmentState
		});
	};

	useEffect(() => {
		try {
			setState({
				fragmentState: JSON.parse(params.json || ''),
				parseSucceeded: true
			});
		} catch (error) {
			setState({
				fragmentState: {},
				parseSucceeded: false
			});
		}
	}, [params]);

	const openInEditor = () => {
		const generatedFragment = generateNewFragment(state.fragmentState, styleClasses, setStyleClasses);

		addFragment(generatedFragment);

		navigate(`/edit/${generatedFragment.id}`);
	};

	return <div className={pageContainerStyle}>
		<h1>UI Fragment - {state.parseSucceeded && state.fragmentState.title ? state.fragmentState.title : ''}</h1>
		<div className={contentContainerStyle}>
			<p>
				<Link to='/'>Carbon UI Builder</Link> enables you
				to <strong>build product pages</strong> with <a href='https://carbondesignsystem.com/' target='_blank' rel="noreferrer">Carbon</a>
				<strong> in a fraction of time</strong> it normally takes you - for <strong>FREE</strong>.
			</p>
			<p>
				You can
				<ul>
					<li>add components</li>
					<li>change layout</li>
					<li>export as</li>
					<ul>
						<li>Angular code</li>
						<li>React code</li>
						<li>Image</li>
						<li>JSON model</li>
					</ul>
				</ul>
			</p>
			<p>
				To add this fragment to your fragments, modify and export it, click the button below.
			</p>
			<Button
			renderIcon={Edit32}
			size='xl'
			onClick={openInEditor}>
				Edit & Export
			</Button>
		</div>

		<h2>Interactive preview</h2>
		<div className={blockContainerStyle}>
			{
				state.parseSucceeded
					? <UIFragment state={state.fragmentState} setState={setFragmentState} />
					: 'Failed to parse JSON.'
			}
		</div>
		<h2>
			JSON model
			<Button
				kind='ghost'
				className={css`margin-top: -6px;`}
				hasIconOnly
				tooltipPosition='right'
				iconDescription='Copy to clipboard'
				onClick={() => copyToClipboard(state.parseSucceeded ? JSON.stringify(state.fragmentState, null, 2) : params.json)}
				renderIcon={Copy16} />
		</h2>
		<Editor
			className={blockContainerStyle}
			height={'500px'}
			language='json'
			value={state.parseSucceeded ? JSON.stringify(state.fragmentState, null, 2) : params.json}
			options={{ readOnly: true }} />
	</div>;
};
