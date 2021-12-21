import React from 'react';
import { TextInput } from 'carbon-components-react';
import { AComponent } from './a-component';
import { CssClassSelector } from '../components/css-class-selector';

export const ATextStyleUI = ({selectedComponent, setComponent, styleClasses}: any) => {
	const setSelectedClasses = (cssClasses: any[]) => {
		setComponent({
			...selectedComponent,
			cssClasses
		});
	};

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
		<CssClassSelector
			styleClasses={styleClasses}
			selectedClasses={selectedComponent.cssClasses}
			setSelectedClasses={setSelectedClasses}
		/>
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
