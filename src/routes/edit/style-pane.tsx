import React, { useContext, useEffect, useState } from 'react';
import { css, cx } from 'emotion';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import {
	Button,
	Checkbox,
	Form,
	Search,
	TextArea,
	TextInput,
	Tag
} from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';
import { leftPane, leftPaneContent } from '.';
import { GlobalStateContext } from '../../context';
import { kebabCase } from 'lodash';

const searchContainerStyle = css`
	display: flex;
	margin-bottom: 1rem;

	button {
		border-bottom: 1px solid #8d8d8d;
	}
`;

export const StylePane = ({ isActive }: any) => {
	const [selectedStyleClassId, setSelectedStyleClassId] = useState('' as string);
	const { styleClasses, setStyleClasses } = useContext(GlobalStateContext);
	const [filterString, setFilterString] = useState('');
	const [_hasDescriptiveName, _setHasDescriptiveName] = useState(false);

	useEffect(() => {
		// reset state when a different class is selected
		_setHasDescriptiveName(false);
	}, [selectedStyleClassId]);

	const getSelectedClass = () => styleClasses.find((c: any) => c.id === selectedStyleClassId) || {};
	const getSelectedClassIndex = () => styleClasses.findIndex((c: any) => c.id === selectedStyleClassId);

	const shouldShow = (styleClass: any) => {
		const matches = [styleClass.name, styleClass.id];
		return !filterString || matches.some((match) => match.includes(filterString));
	};

	const hasDescriptiveName = () => {
		const selectedClass = getSelectedClass();
		return _hasDescriptiveName || selectedClass.name !== selectedClass.id;
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
		const selectedClass = getSelectedClass();

		updateSelectedClass({
			...selectedClass,
			name
		});
	};

	const updateSelectedClassId = (id: string) => {
		const selectedClass = getSelectedClass();

		updateSelectedClass({
			...selectedClass,
			id,
			name: hasDescriptiveName() ? selectedClass.name : id
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

	const setHasDescriptiveName = (hasName: boolean) => {
		if (!hasName) {
			updateSelectedClassName(getSelectedClass().id);
		}
		_setHasDescriptiveName(hasName);
	};

	return (
		<div className={cx(leftPane, isActive ? 'is-active' : '')}>
			<Form>
				<div className={searchContainerStyle}>
					<Search
						id='styles-search'
						light
						labelText='Filter classes'
						placeholder='Filter classes'
						onChange={(event: any) => setFilterString(event.target.value)} />
					<Button
						kind='ghost'
						renderIcon={Add16}
						iconDescription='Add new class'
						hasIconOnly
						tooltipPosition='left'
						onClick={addNewStyleClass} />
				</div>
				<div className={leftPaneContent}>
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
						labelText='CSS selector'
						helperText='Value used in development'
						value={getSelectedClass().id || ''}
						disabled={!getSelectedClass().id}
						onChange={(event: any) => {
							updateSelectedClassId(event.currentTarget.value);
						}}
						onBlur={() => {
							updateSelectedClassId(kebabCase(getSelectedClass().id));
						}}
						onFocus={(event: any) => event.target.select()}
					/>
					<Checkbox
						id='has-descriptive-name-checkbox'
						labelText='Add descriptive name'
						disabled={!getSelectedClass().id}
						checked={hasDescriptiveName()}
						onChange={(event: any) => setHasDescriptiveName(event)} />
					{
						hasDescriptiveName() && <TextInput
							labelText='Descriptive name'
							helperText='Name that appears in tags and search'
							value={getSelectedClass().name || ''}
							disabled={!getSelectedClass().id}
							onChange={(event: any) => {
								updateSelectedClassName(event.currentTarget.value);
							}}
						/>
					}
					<TextArea
						value={getSelectedClass().content || ''}
						labelText={getSelectedClass().id || 'Select a class first'}
						helperText='Put CSS properties for your class here'
						disabled={!getSelectedClass().id}
						onChange={(event: any) => {
							updateSelectedClassContent(event.currentTarget.value);
						}}
					/>
				</div>
			</Form>
		</div>
	);
};
