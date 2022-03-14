import React, { useContext } from 'react';
import {
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';

import image from './../assets/component-icons/button.svg';
import { GlobalStateContext } from '../context';

export const AFragmentStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Show outline'
			id='fragment-showOutline'
			checked={selectedComponent.showOutline}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				showOutline: checked
			})} />
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>;
};

export const AFragmentCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						name: event.currentTarget.value
					}
				});
			}}
		/>
	</>;
};

const showOutlineStyle = css`
	outline: 1px dashed #78a9ff;
`;

export const AFragment = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
			componentObj={componentObj}
			className={css`position: relative; display: inline-flex`}
			{...rest}>
			<div
				style={{ pointerEvents: 'none' }}
				className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				componentObj.showOutline ? showOutlineStyle : ''
				)}>
				{children}
			</div>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AFragment,
	styleUI: AFragmentStyleUI,
	render: ({ componentObj, select, remove, selected, renderComponents }) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const globalState = useContext(GlobalStateContext); // used for fetching subcomponents/microlayouts
		const subFragment = globalState?.getFragment(componentObj.id);

		if (!subFragment) {
			return ''; // NOTE should we also remove it from the fragment?
		}

		return <AFragment
			componentObj={componentObj}
			select={select}
			remove={remove}
			selected={selected}>
			{ renderComponents(subFragment.data) }
		</AFragment>;
	},
	keywords: ['fragment'],
	name: 'Fragment',
	hideFromElementsPane: true,
	defaultComponentObj: {
		type: 'fragment'
	},
	image,
	codeExport: { // TODO exports
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
