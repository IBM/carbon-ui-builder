import React, { useEffect } from 'react';
import { RadioButton, Checkbox, TextInput } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { css, cx } from 'emotion';
import { useFragment } from '../context';
import image from './../assets/component-icons/radiobutton.svg';
import { Add32 } from '@carbon/icons-react';
import { getParentComponent, updatedState } from '../components';
export const ARadioButtonStyleUI = ({selectedComponent, setComponent}: any) => {
	return <>
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

const addStyle = css`
	position: absolute;
	margin-top: -2px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
	z-index: 1;
	display: block !important;
`;

const addStyleTop = cx(addStyle, css`
	margin-top: -18px;
`);

const iconStyle = css`
	height: 1rem;
	width: 1rem;
	float: right;
	cursor: pointer;
`;

export const ARadioButtonCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						labelText: event.currentTarget.value
					}
				});
			}}
		/>
		<TextInput
			value={selectedComponent.codeContext?.tileId || ''}
			labelText='Input ID'
			placeholder='Custom ID'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						id: event.currentTarget.value
					}
				});
			}}
		/>
		<TextInput
			value={selectedComponent.codeContext?.value || ''}
			labelText='Value'
			placeholder='Button value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						value: event.currentTarget.value
					}
				});
			}}
		/>
	</>
};


export const ARadioButton = ({
	children,
	componentObj,
	onDrop,
	selected,
	renderComponents,
	...rest
}: any) => {
	useEffect(() => {
		const radioElement = document.getElementById(componentObj.id.toString());
		const labelElement = radioElement?.parentElement?.querySelector('label.bx--radio-button__label');
		labelElement?.setAttribute('for', '');
	}, [componentObj.id]);

	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addRadio = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'radioButton',
					codeContext: {
						value: 'Button',
						formItemName: componentObj.formItemName
					},
					items: [{ type: 'text', text: 'New radio button' }]
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	return <>
		<span style={{ display: 'none' }} className={selected ? addStyleTop : ''}>
				<Add32 onClick={(event: any) => {
					event.stopPropagation();
					addRadio();
				}} className={iconStyle} />
		</span>
		<AComponent
			selected={selected}
			headingCss={css`display: block;`}
			componentObj={componentObj}
			{...rest}>
               
            <RadioButton
				id={componentObj.id.toString()}
				name={componentObj.codeContext?.formItemName}
				disabled={componentObj.disabled}
                labelText={componentObj.codeContext?.formItemName}
                value={componentObj.codeContext?.value}
                className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
					{children}
            </RadioButton>          
		</AComponent>
		<span style={{ display: 'none' }} className={selected ? addStyle : ''}>
			<Add32 onClick={(event: any) => {
				event.stopPropagation();
				addRadio(1);
			}} className={iconStyle} />
		</span>
		</>
};

export const componentInfo: ComponentInfo = {
	component: ARadioButton,
	styleUI: ARadioButtonStyleUI,
	codeUI: ARadioButtonCodeUI,
	keywords: ['radiobutton', 'radio button'],
	name: 'Radio button',
	defaultComponentObj: {
		disabled: false,
		type: 'radioButton',
		items: []
	},
	image,
	render: ({ componentObj, select, remove, selected, renderComponents }) => <ARadioButton
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{componentObj.items.map((button: any) => (renderComponents(button)))}
	</ARadioButton>,
	codeExport: {
		angular: {
			inputs: ({json}) => ``,
            outputs: ({json}) => ``,
            imports: [''],
			code: ({json }) => {
				return ``;
			}
		},
		react: {
			imports: [''],
			code: ({ json }) => {
                return ``;
			}
		}
	}
};