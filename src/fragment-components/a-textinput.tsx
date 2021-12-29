import React from 'react';
import { TextInput, Dropdown } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';

export const ATextInputStyleUI = ({selectedComponent, setComponent}: any) => {
	const typeItems = [
		{id: 'text', text: 'Text'},
		{id: 'email', text: 'Email'},
		{id: 'password', text: 'Password'}
	];

	return <>
		<Dropdown
			label='Type'
			titleText='Type'
			items={typeItems}
			initialSelectedItem={typeItems.find(item => item.id === selectedComponent.inputType)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				inputType: event.selectedItem.id
		})}/>
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
			value={selectedComponent.helperText}
			labelText='Helper text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					helperText: event.currentTarget.value
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
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ATextInputCodeUI = ({selectedComponent, setComponent}: any) => {
	return <>
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
	</>
};

export const ATextInput = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
			<TextInput
				type={componentObj.inputType}
				labelText={componentObj.label}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
				{...componentObj}
				{...rest} />
		</AComponent>
	);
};
