import React, { useState } from 'react';
import { cx } from 'emotion';
import {
	ComboBox,
	Form,
	TextArea,
	TextInput,
	Tag
} from 'carbon-components-react';
import { leftPane } from '.';

export const StylePane = ({isActive, styleClasses, setStyleClasses}: any) => {
	const [selectedStyleClassId, setSelectedStyleClassId] = useState('' as string);

	const getSelectedClass = () => styleClasses.find((c: any) => c.id === selectedStyleClassId) || {};
	const getSelectedClassIndex = () => styleClasses.findIndex((c: any) => c.id === selectedStyleClassId);

	const updateSelectedClass = (newClass: any) => {
		const selectedClassIndex = getSelectedClassIndex();
		if (selectedClassIndex < 0) {
			return;
		}
		setStyleClasses([
			...styleClasses.slice(0, selectedClassIndex),
			newClass,
			...styleClasses.slice(selectedClassIndex + 1)
		]);
	};

	const updateSelectedClassContent = (content: string | undefined) => {
		updateSelectedClass({
			...getSelectedClass(),
			content: content || ''
		});
	};

	const updateSelectedClassName = (name: string) => {
		updateSelectedClass({
			...getSelectedClass(),
			name
		});
	};

	const updateSelectedClassId = (id: string) => {
		updateSelectedClass({
			...getSelectedClass(),
			id
		});
		setSelectedStyleClassId(id);
	};

	const classSelectorComboRef = React.createRef<any>();

	const handleOnKeypress = (event: any) => {
		const currentValue = classSelectorComboRef.current.textInput.current.value.trim();
		if (event.key === 'Enter' && currentValue) {
			const newItem = {
				id: currentValue.split(' ').join('-').toLowerCase(),
				name: currentValue,
				content: ''
			};
			if (getSelectedClassIndex() < 0) {
				setStyleClasses([...styleClasses, newItem]);
			}
			setSelectedStyleClassId(newItem.id);
		}
	};

	return (
		<div className={cx(leftPane, isActive ? 'is-active' : '')}>
			Style <br /><br />
			<Form>
				{
					styleClasses.map((styleClass: any) => (
						<Tag
						filter
						onClick={() => setSelectedStyleClassId(styleClass.id)}
						onClose={() => {}}>
							{styleClass.name}
						</Tag>
					))
				}
				<div onKeyDown={handleOnKeypress}>
					<ComboBox
						id='style-pane-class-selector'
						titleText='(S)CSS class name'
						items={styleClasses}
						ref={classSelectorComboRef}
						itemToString={(item: any) => item ? item.name : ''}
						placeholder='Select class or add new'
						selectedItem={getSelectedClass()}
						onChange={(event: any) => {
							setSelectedStyleClassId(event.selectedItem ? event.selectedItem.id : '');
						}}
					/>
				</div> <br />
				<TextInput
					labelText='Descriptive name'
					helperText='Name that appears in tags and search'
					value={getSelectedClass().name || ''}
					disabled={!getSelectedClass().id}
					onChange={(event: any) => {
						updateSelectedClassName(event.currentTarget.value);
					}}
				/>
				<TextInput
					labelText='CSS selector'
					helperText='Value used in development'
					value={getSelectedClass().id || ''}
					disabled={!getSelectedClass().id}
					onChange={(event: any) => {
						updateSelectedClassId(event.currentTarget.value);
					}}
				/>
				<TextArea
					value={getSelectedClass().content || ''}
					labelText={getSelectedClass().id || 'Select a class first'}
					helperText='Put CSS properties for your class here'
					disabled={!getSelectedClass().id}
					onChange={(event: any) => {
						updateSelectedClassContent(event.currentTarget.value);
					}}
				/>
			</Form>
		</div>
	);
};
