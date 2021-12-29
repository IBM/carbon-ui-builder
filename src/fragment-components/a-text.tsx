import React from 'react';
import { TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';

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
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const AText = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
		{...rest}>
			{children}
		</AComponent>
	);
};
