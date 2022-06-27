import React from 'react';
import {
	Button,
	Dropdown,
	TextInput
} from 'carbon-components-react';
import { css } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/button.svg';
import { angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const AButtonSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const kindItems = [
		{ id: 'primary', text: 'Primary' },
		{ id: 'secondary', text: 'Secondary' },
		{ id: 'tertiary', text: 'Tertiary' },
		{ id: 'danger', text: 'Danger' },
		{ id: 'danger--tertiary', text: 'Danger tertiary' },
		{ id: 'danger--ghost', text: 'Danger ghost' },
		{ id: 'ghost', text: 'Ghost' }
	];

	return <>
		<TextInput
			value={selectedComponent.text}
			labelText='Text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				text: event.currentTarget.value
			})} />
		<Dropdown
			label='Kind'
			titleText='Kind'
			items={kindItems}
			selectedItem={kindItems.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				kind: event.selectedItem.id
			})} />
	</>;
};

export const AButtonCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						name: event.currentTarget.value
					}
				});
			}}
		/>;
};

export const AButton = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		className={css`position: relative; display: inline-flex`}
		{...rest}>
			<Button
			kind={componentObj.kind}
			disabled={componentObj.disabled}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{children}
			</Button>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AButton,
	settingsUI: AButtonSettingsUI,
	codeUI: AButtonCodeUI,
	render: ({ componentObj, select, remove, selected }) => <AButton
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.text}
	</AButton>,
	keywords: ['button'],
	name: 'Button',
	type: 'button',
	defaultComponentObj: {
		type: 'button',
		kind: 'primary',
		text: 'Button'
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
			imports: ['ButtonModule'],
			code: ({ json }) => {
				return `<button
					${json.kind ? `ibmButton='${json.kind}'` : 'ibmButton'}
					(click)='${nameStringToVariableString(json.codeContext?.name)}Clicked.emit()'
					${angularClassNamesFromComponentObj(json)}>
						${json.text}
				</button>`;
			}
		},
		react: {
			imports: ['Button'],
			code: ({ json }) => {
				return `<Button${json.kind && ` kind="${json.kind}"`} ${reactClassNamesFromComponentObj(json)}>${json.text}</Button>`;
			}
		}
	}
};
