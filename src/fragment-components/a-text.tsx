import React from 'react';
import { TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';

export const ATextStyleUI = ({selectedComponent, setComponent}: any) => {
	return <>
		<TextInput
			value={selectedComponent.text}
			labelText='Text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					text: event.currentTarget.value
				});
			}}
		/>
	</>
};

export const AText = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent componentObj={componentObj} {...rest}>
			{children}
		</AComponent>
	);
};
