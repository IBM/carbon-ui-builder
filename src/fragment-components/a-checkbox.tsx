import React from 'react';
import { Checkbox, TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { CssClassSelector } from '../components/css-class-selector';

export const ACheckboxStyleUI = ({selectedComponent, setComponent}: any) => {
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
		<CssClassSelector
			selectedClasses={selectedComponent.cssClasses}
			setSelectedClasses={setSelectedClasses}
		/>
	</>
};

export const ACheckboxCodeUI = ({selectedComponent, setComponent}: any) => {
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

export const ACheckbox = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		{...rest}>
			<Checkbox
				kind={componentObj.kind}
				disabled={componentObj.disabled}
				labelText={componentObj.label}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} />
		</AComponent>
	);
};
