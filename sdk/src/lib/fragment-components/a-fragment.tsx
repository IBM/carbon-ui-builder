import React from 'react';
import {
	Checkbox,
	TextInput
} from '@carbon/react';
import { Edit } from '@carbon/react/icons';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/button.svg';
import { classNameFromFragment, tagNameFromFragment } from '../helpers/tools';
// import { LinkButton } from '../../../components';

export const AFragmentSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		{/**
		 * @todo - LinkButton is component in `App`
		 */}
		{/* <LinkButton
		kind='secondary'
		size='sm'
		renderIcon={Edit}
		className={css`margin-bottom: 1rem`}
		to={`/edit/${selectedComponent.fragmentId}`}>
			Edit fragment
		</LinkButton> */}
		<Checkbox
			labelText='Show outline'
			id='fragment-outline'
			checked={selectedComponent.outline}
			onChange={(_: any, { checked }: any) => setComponent({
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
			style={{ pointerEvents: 'none', display: 'inline' }}
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
	render: ({ componentObj, select, remove, selected, renderComponents, outline, fragments }) => {
		const subFragment = fragments.find((f: any) => f.id === componentObj.fragmentId);

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
			latest: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: [],
				code: ({ json, fragments }) => {
					const fragment = fragments?.find(f => f.id === json.fragmentId);
					return `<app-${tagNameFromFragment(fragment)}></app-${tagNameFromFragment(fragment)}>`;
				}
			},
			v10: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: [],
				code: ({ json, fragments }) => {
					const fragment = fragments?.find(f => f.id === json.fragmentId);
					return `<app-${tagNameFromFragment(fragment)}></app-${tagNameFromFragment(fragment)}>`;
				}
			}
		},
		react: {
			latest: {
				imports: [],
				otherImports: ({ json, fragments }) => {
					const fragment = fragments?.find(f => f.id === json.fragmentId);
					return `import {${classNameFromFragment(fragment)}} from "/src/shared/${tagNameFromFragment(fragment)}.js";`;
				},
				code: ({ json, fragments }) => {
					const fragment = fragments?.find(f => f.id === json.fragmentId);
					return `<${classNameFromFragment(fragment)} state={state} setState={setState} />`;
				}
			},
			v10: {
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
	}
};
