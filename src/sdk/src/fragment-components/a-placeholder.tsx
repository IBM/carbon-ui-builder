import React from 'react';
import { css } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

const placeholderStyle = css`
	width: 100%;
	height: 100%;
	min-height: 1rem;
	min-width: 1rem;
	margin: auto;
	padding: 1rem;
	color: #8d8d8d;
`;

export const APlaceholderSettingsUI = ({ _selectedComponent, _setComponent }: any) => {
	return <>
	</>;
};

export const APlaceholder = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<div className={placeholderStyle}>Drop an element here</div>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: APlaceholder,
	settingsUI: APlaceholderSettingsUI,
	render: ({ componentObj, select, remove, selected }) => <APlaceholder
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.text}
	</APlaceholder>,
	keywords: ['placeholder'],
	name: 'Placeholder',
	type: 'placeholder',
	hideFromElementsPane: true,
	defaultComponentObj: {
		type: 'placeholder'
	},
	image: undefined,
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: () => '',
			imports: [],
			code: () => ''
		},
		react: {
			imports: [],
			code: () => ''
		}
	}
};
