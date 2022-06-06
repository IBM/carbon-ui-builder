import React, { useContext, useState } from 'react';
import { css, cx } from 'emotion';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import {
	Button,
	Form,
	Search,
	TextArea,
	TextInput,
	Tag
} from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';
import { leftPane } from '.';
import { GlobalStateContext } from '../../context';

const searchContainerStyle = css`
	display: flex;
	margin-bottom: 1rem;
	padding-top: 1rem;

	button {
		border-bottom: 1px solid #8d8d8d;
	}
`;

export const StylePane = ({ isActive }: any) => {
	const [selectedStyleClassId, setSelectedStyleClassId] = useState('' as string);
	const { styleClasses, setStyleClasses } = useContext(GlobalStateContext);
	const [filterString, setFilterString] = useState('');

	const getSelectedClass = () => styleClasses.find((c: any) => c.id === selectedStyleClassId) || {};
	const getSelectedClassIndex = () => styleClasses.findIndex((c: any) => c.id === selectedStyleClassId);

	const shouldShow = (styleClass: any) => {
		const matches = [styleClass.name, styleClass.id];
		return !filterString || matches.some((match) => match.includes(filterString));
	};

	const getUniqueClass = (): any => {
		const className = uniqueNamesGenerator({
			dictionaries: [adjectives, colors, animals],
			separator: '-',
			length: 3
		});

		if (!styleClasses.find((sc: any) => sc.id === className || sc.name === className)) {
			return {
				id: className,
				name: className
			};
		}

		return getUniqueClass();
	};

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

	const addNewStyleClass = () => {
		const newStyleClass = getUniqueClass();
		setStyleClasses([...styleClasses, newStyleClass]);
		setSelectedStyleClassId(newStyleClass.id);
	};

	const removeStyleClass = (styleClassId: string) => {
		setStyleClasses(styleClasses.filter((sc: any) => sc.id !== styleClassId));
	};

	return (
		<div className={cx(leftPane, isActive ? 'is-active' : '')}>
			<Form>
				<div className={searchContainerStyle}>
					<Search
						id="styles-search"
						light
						labelText="Filter classes"
						placeholder="Filter classes"
						onChange={(event: any) => setFilterString(event.target.value)} />
					<Button
						kind="ghost"
						renderIcon={Add16}
						iconDescription="Add new class"
						hasIconOnly
						onClick={addNewStyleClass} />
				</div>
				{
					styleClasses.filter(shouldShow).map((styleClass: any) => (
						<Tag
						key={styleClass.name}
						filter
						onClick={() => setSelectedStyleClassId(styleClass.id)}
						onClose={() => removeStyleClass(styleClass.id)}>
							{styleClass.name}
						</Tag>
					))
				} <br />
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
