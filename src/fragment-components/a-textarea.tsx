import React from 'react';
import { TextArea, TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { CssClassSelector } from '../components/css-class-selector';

export const ATextAreaStyleUI = ({selectedComponent, setComponent}: any) => {
	const setSelectedClasses = (cssClasses: any[]) => {
		setComponent({
			...selectedComponent,
			cssClasses
		});
	};

	return <>
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
		<CssClassSelector
			selectedClasses={selectedComponent.cssClasses}
			setSelectedClasses={setSelectedClasses}
		/>
	</>
};


export const ATextAreaCodeUI = ({selectedComponent, setComponent}: any) => {
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
	</>
};

export const ATextArea = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent componentObj={componentObj} {...rest}>
			<TextArea
				kind={componentObj.kind}
				disabled={componentObj.disabled}
				labelText={componentObj.label}
				placeholder={componentObj.placeholder}
				helperText={componentObj.helperText}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};
