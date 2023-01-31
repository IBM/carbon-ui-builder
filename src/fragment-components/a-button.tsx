import {
	Button,
	Dropdown,
	TextInput
} from 'carbon-components-react';
import { css } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/button.svg';
import { angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../utils/fragment-tools';
import { ActionsEditor } from '../routes/edit/actions';
import { time } from 'console';
import { useFragment } from '../context';
import { idText } from 'typescript';
import { useState } from 'react';

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
	const [fragment, setFragment] = useFragment();

	const [actions, setActions] = useState([
		{ 	
			text: 'On click',
			source: selectedComponent.codeContext.name, 
			signal: 'onclick',
			destination: '', 
			slot: '',
			id: 1,
		},
	] as { 
		text: string;
		source: string;
		signal: string;
		destination: string;
		slot: string;
		id: number;
	}[]);

	// Default value (?)
	// Maybe always have 1 signal of each type in the UI that can't be deleted
	// + or X buttons add or remove additional signals, if only 1 click signal, no delete?
	// const signals: { text: string; source: string; signal: string; destination: string; slot: string; id: number; }[] = [
	// 	{ 	
	// 		text: 'On click',
	// 		source: selectedComponent.codeContext.name, 
	// 		signal: 'onclick',
	// 		destination: '', 
	// 		slot: '',
	// 		id: 1,
	// 	},
	// ];

	// setFragment({...fragment, data: {
	// 	...fragment.data, actions: signals}});
	// console.log('fragment 2', fragment);

	const addAction = (text: string, source: string, signal: string) => {

		// Don't allow adding if there is an empty action present

		let id = 0;
		// Create a unique id (largest id value in the array)
		actions.forEach(signal => id = (signal.id >= id) ? id = signal.id + 1 : id);

		setActions([...actions, {
				text: text,
				source: source,
				signal: signal,
				destination: '',
				slot: '',
				id: id,
			}]);

		// signals.push({
		// 	text: text,
		// 	source: source,
		// 	signal: signal,
		// 	destination: '',
		// 	slot: '',
		// 	id: id,
		// });

		// const newSignals = signals;
		console.log('signals 1', actions);
		// setComponent({...selectedComponent, signals: newSignals});

		// setFragment({...fragment, data: {
		// // 	...fragment.data, actions: signals}});
		// console.log('fragment 3', fragment);
	}

	console.log('signals 2', actions);

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
			{ actions.map((item) => {
				return <ActionsEditor signal={item} addAction={addAction} key={item.id} />;
			})}
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

// TODO: Make up 2/3 data structures for where to store what actions (signals AND slots) the button supports
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
