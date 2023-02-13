import React from 'react';
import {
	Button,
	Dropdown,
	TextInput
} from 'carbon-components-react';
import { css } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/button.svg';
import {
	angularClassNamesFromComponentObj,
	getFragmentById, nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

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
		size: '',
		disabled: false
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: ({ json, actions }) => {
				const name = nameStringToVariableString(json.codeContext?.name);
				let res = '';
				let clickAdded = false;

				actions.forEach((a: any) => {
					if (a.source === json.id && a.signal === 'click' && !clickAdded) {
						res += `@Output() ${name}ClickedSignal: boolean = false;`;
						clickAdded = true;
					}
				});

				return `@Output() ${name}Clicked = new EventEmitter();` + res;
			},
			imports: ['ButtonModule'],
			code: ({ json, actions, fragments }) => {
				const name = nameStringToVariableString(json.codeContext?.name);
				let clickAction = '';
				let disabled = '';
				let clickAdded = false;

				if (actions) {
					actions.forEach((a: any) => {
						if (a.source === json.id) {
							if (a.signal === 'click' && !clickAdded) {
								clickAction += `${name}ClickedSignal = !${name}ClickedSignal;`;
								clickAdded = true;
							}
						}

						if (a.destination === json.id) {
							if (a.slot === 'isVisible') {
								const source = getFragmentById(fragments[0], a.source);
								const sName = nameStringToVariableString(source.codeContext?.name);
								disabled += (disabled !== '' ? ' || ' : '');
								disabled += `${sName}ClickedSignal`;
							}
						}
					});
				}

				return `<button
					${json.kind ? `ibmButton='${json.kind}'` : 'ibmButton'}
					${json.size ? `size='${json.size === 'default' ? 'normal' : json.size}'` : ''}
					(click)='${name}Clicked.emit(); ${clickAdded ? clickAction : ''}'
					${disabled === '' ? '' : '[disabled]="' + disabled + '"'}
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
