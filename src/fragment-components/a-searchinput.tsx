import React from 'react';
import { TextInput, Dropdown, Search } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/search.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ASearchInputSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'lg', text: 'Large' },
		{ id: 'xl', text: 'Extra large' }
	];

	return <>
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.inputSize)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				inputSize: event.selectedItem.id
			})} />
		<TextInput
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					label: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					placeholder: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.defaultValue}
			labelText='Default value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					defaultValue: event.currentTarget.value
				});
			}}
		/>
	</>;
};

export const ASearchInputCodeUI = ({ selectedComponent, setComponent }: any) => {
	return (
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
	);
};

export const ASearchInput = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		rejectDrop={true}
		{...rest}>
			<Search
				size={componentObj.inputSize}
				labelText={componentObj.label}
				placeholder={componentObj.placeholder}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
				id={componentObj.id}
				autoComplete={componentObj.autoComplete || 'off'}
				closeButtonLabelText={componentObj.closeButtonLabelText || 'Clear search input'}
				defaultValue={componentObj.defaultValue}
				disabled={componentObj.disabled}
				light={componentObj.light}
				role={componentObj.role || 'searchbox'}
				type={componentObj.type || 'text'} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASearchInput,
	settingsUI: ASearchInputSettingsUI,
	codeUI: ASearchInputCodeUI,
	keywords: ['search', 'search input'],
	name: 'Search',
	type: 'search',
	defaultComponentObj: {
		type: 'search',
		label: 'Search',
		placeholder: 'Search',
		inputSize: 'lg'
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['SearchModule'],
			code: ({ json }) => {
				return `<ibm-search
					${angularClassNamesFromComponentObj(json)}
					name="${json.codeContext?.name}"
					placeholder="${json.placeholder}">
				</ibm-search>`;
			}
		},
		react: {
			imports: ['Search'],
			code: ({ json }) => {
				return `<Search
					labelText="${json.label}"
					name="${json.codeContext?.name}"
					placeholder="${json.placeholder}"
					value={state["${json.codeContext?.name}"]}
					${reactClassNamesFromComponentObj(json)}
					onChange={handleInputChange} />`;
			}
		}
	}
};
