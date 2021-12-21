import React from 'react';
import {
	Button,
	Dropdown,
	TextInput
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { CssClassSelector } from '../components/css-class-selector';

export const AButtonStyleUI = ({selectedComponent, setComponent, styleClasses}: any) => {
	const kindItems = [
		{id: 'primary', text: 'Primary'},
		{id: 'secondary', text: 'Secondary'},
		{id: 'tertiary', text: 'Tertiary'},
		{id: 'danger', text: 'Danger'},
		{id: 'danger--tertiary', text: 'Danger tertiary'},
		{id: 'danger--ghost', text: 'Danger ghost'},
		{id: 'ghost', text: 'Ghost'}
	];

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
		<Dropdown
			label='Kind'
			titleText='Kind'
			items={kindItems}
			initialSelectedItem={kindItems.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				kind: event.selectedItem.id
		})}/>
		<CssClassSelector
			styleClasses={styleClasses}
			selectedClasses={selectedComponent.cssClasses}
			setSelectedClasses={setSelectedClasses}
		/>
	</>
};

export const AButton = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		className={css`position: relative; display: inline-flex`}
		{...rest}>
			<Button
			kind={componentObj.kind}
			disabled={componentObj.disabled}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{children}
			</Button>
		</AComponent>
	);
};
