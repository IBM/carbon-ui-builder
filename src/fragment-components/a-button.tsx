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

	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'field', text: 'Medium' },
		{ id: 'lg', text: 'Large' },
		{ id: 'xl', text: 'Extra large' },
		{ id: 'default', text: 'Default' }
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
			id='kind'
			label='Kind'
			titleText='Kind'
			items={kindItems}
			selectedItem={kindItems.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				kind: event.selectedItem.id
			})} />
		<Dropdown
			id='size'
			label='Select a size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
	</>;
};

export const AButtonCodeUI = ({ selectedComponent, setComponent }: any) => {

	const actionChange = (data: { target: { name: string; value: any; }; }) => {
		console.log('CONNOR selectedComponent:', selectedComponent);
		console.log('CONNOR setComponent:', setComponent);
		console.log('CONNOR data', data);
	}

	// Should be dynamic
	// Should depend on the target element
	// Should only list the compatible slot actions
	const slotDropdownItems: {text: string}[] = [
		{ text: "Toggle Disable" },
		{ text: "Toggle Visibility" }
	]; 

	// Should be dynamic
	// Should give a list of elements in current app that can be used as slots
	const elementDropdownItems: {text: string}[] = [
		{ text: "Button" }
	];

	return (
		<>
			<TextInput
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
			/>
			<div style={{border: '2px #525252 solid', padding: '10px', margin: '5px'}}>
				<h6 style={{color: '#323232', marginBottom: '5px', fontWeight: 'normal', textDecoration: 'underline'}}>On Click</h6>
				<Dropdown
					id="elementDropdown"
					titleText="Element"
					helperText="Your existing elements"
					label=""
					items={elementDropdownItems}
					itemToString={(item: any) => (item ? item.text : "")}
					onChange={(selectedItem: any) =>
						actionChange({
							target: {
								name: "elementDropdown",
								value: selectedItem
							}
						})
					}
				/>
				<Dropdown
					id="slotDropdown"
					titleText="Slot"
					helperText="What changes on the element"
					label=""
					items={slotDropdownItems}
					itemToString={(item: any) => (item ? item.text : "")}
					onChange={(selectedItem: any) =>
						actionChange({
							target: {
								name: "slotDropdown",
								value: selectedItem
							}
						})
					}
				/>
				<Button kind="ghost" className="title">
					+
				</Button>
			</div>
		</>
	);
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
			size={componentObj.size}
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
		text: 'Button',
		size: ''
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
					${json.size ? `size='${json.size === 'default' ? 'normal' : json.size}'` : ''}
					(click)='${nameStringToVariableString(json.codeContext?.name)}Clicked.emit()'
					${angularClassNamesFromComponentObj(json)}>
						${json.text}
				</button>`;
			}
		},
		react: {
			imports: ['Button'],
			code: ({ json }) => {
				return `<Button
					${json.kind && `kind="${json.kind}"`}
					${json.size && `size="${json.size}"`}
					${reactClassNamesFromComponentObj(json)}>${json.text}</Button>`;
			}
		}
	}
};
