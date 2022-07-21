import React, { useContext } from 'react';
import {
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { Edit32 } from '@carbon/icons-react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/button.svg';
import { GlobalStateContext } from '../context';
import { classNameFromFragment, getFragmentsFromLocalStorage, tagNameFromFragment } from '../utils/fragment-tools';
import { LinkButton } from '../components';
import { getFragmentHelpers } from '../context/fragments-context-helper';

export const AFragmentSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<LinkButton
		kind='secondary'
		size='sm'
		renderIcon={Edit32}
		className={css`margin-bottom: 1rem`}
		to={`/edit/${selectedComponent.fragmentId}`}>
			Edit fragment
		</LinkButton>
		<Checkbox
			labelText='Show outline'
			id='fragment-outline'
			checked={selectedComponent.outline}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				outline: checked
			})} />
	</>;
};

export const AFragmentCodeUI = ({ selectedComponent, setComponent }: any) => {
	return (
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
	);
};

const outlineStyle = css`
	outline: 1px dashed #78a9ff;
`;

export const AFragment = ({
	children,
	componentObj,
	outline,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		className={css`position: relative;`}
		rejectDrop={true}
		{...rest}>
			<section
			style={{ pointerEvents: 'none' }}
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				(componentObj.outline || outline === true) && outline !== false ? outlineStyle : ''
			)}>
				{children}
			</section>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AFragment,
	settingsUI: AFragmentSettingsUI,
	render: ({ componentObj, select, remove, selected, renderComponents, outline }) => {
		// try to use the state but get the fragments from local storage if state is not available
		// localStorage info is used when rendering and can't be used for interaction
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const { getFragment } = useContext(GlobalStateContext) || getFragmentHelpers({ fragments: getFragmentsFromLocalStorage() });

		const subFragment = getFragment(componentObj.fragmentId);

		if (!subFragment) {
			return ''; // NOTE should we also remove it from the fragment?
		}

		return <AFragment
			componentObj={componentObj}
			select={select}
			remove={remove}
			outline={outline}
			selected={selected}>
				{renderComponents(subFragment.data, outline)}
		</AFragment>;
	},
	keywords: ['fragment'],
	name: 'Fragment',
	hideFromElementsPane: true,
	type: 'fragment',
	defaultComponentObj: {
		type: 'fragment'
	},
	image,
	codeExport: { // TODO exports
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: [],
			code: ({ json, fragments }) => {
				const fragment = fragments?.find(f => f.id === json.fragmentId);
				return `<app-${tagNameFromFragment(fragment)}></app-${tagNameFromFragment(fragment)}>`;
			}
		},
		react: {
			imports: [],
			otherImports: ({ json, fragments }) => {
				const fragment = fragments?.find(f => f.id === json.fragmentId);
				return `import {${classNameFromFragment(fragment)}} from "/src/shared/${tagNameFromFragment(fragment)}.js";`;
			},
			code: ({ json, fragments }) => {
				const fragment = fragments?.find(f => f.id === json.fragmentId);
				return `<${classNameFromFragment(fragment)} state={state} setState={setState} />`;
			}
		}
	}
};
