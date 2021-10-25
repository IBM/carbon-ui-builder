import React from 'react';
import domtoimage from 'dom-to-image';
import ReactDOM from 'react-dom';
import { Fragment } from '../components';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface RenderProps {
	id: string,
	name: string,
	width?: number,
	height?: number,
	format?: string,
	preview?: { // only sent for preview
		format?: string, // optional
		width: number,
		height: number
	}
}

export const getFragmentPreview = async(fragment: any, props: RenderProps) => {
	const element = document.createElement('div');
	element.className = 'render-preview';

	(element as HTMLElement).style.position = 'absolute';
	(element as HTMLElement).style.top = '0';
	(element as HTMLElement).style.left = '0';
	(element as HTMLElement).style.zIndex = '-1';
	(element as HTMLElement).style.width = `${props.width || 800}px`;
	(element as HTMLElement).style.height = `${props.height || 400}px`;
	(element as HTMLElement).style.minHeight = `${props.height || 400}px`;
	ReactDOM.render(React.createElement(Fragment, {fragment}), element);
	document.body.appendChild(element);

	await sleep(100); // wait for render to finish

	const imageBlob = await domtoimage.toBlob(element as Node);
	(element as HTMLElement).remove();
	return imageBlob;
};
