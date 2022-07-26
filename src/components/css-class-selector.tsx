import React, { useContext, useEffect, useState } from 'react';
import {
	FormLabel,
	Tag
} from 'carbon-components-react';
import { GlobalStateContext } from '../context';

const compareClasses = (sc1: any, sc2: any) => sc1.name < sc2.name ? -1 : 1;

export const CssClassSelector = ({ selectedClasses, setSelectedClasses }: any) => {
	const { styleClasses } = useContext(GlobalStateContext);

	const getAvailableClasses = () => {
		// available is anything in styleClasses, not yet in selecteClasses, sorted
		return styleClasses
			.filter((sc: any) => !selectedClasses?.find((ssc: any) => ssc.id === sc.id))
			.sort(compareClasses);
	};

	const [availableClasses, setAvailableClasses] = useState(getAvailableClasses());

	useEffect(() => {
		if (!selectedClasses) {
			setSelectedClasses([]);
		}
	}, [selectedClasses, setSelectedClasses]);

	useEffect(() => {
		// update available classes based on styleClasses and selectedClasses
		setAvailableClasses(getAvailableClasses());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [styleClasses, selectedClasses]);

	useEffect(() => {
		// update the contents of selected classes when needed
		setSelectedClasses(
			styleClasses.filter((sc: any) => !!selectedClasses?.find((ssc: any) => ssc.id === sc.id)),
			false
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [styleClasses]);

	const selectStyleClass = (styleClass: any) => {
		setSelectedClasses([...selectedClasses, styleClass]);
		setAvailableClasses(availableClasses.filter((c: any) => c.id !== styleClass.id));
	};

	const deselectStyleClass = (styleClass: any) => {
		setSelectedClasses(selectedClasses.filter((c: any) => c.id !== styleClass.id));
		setAvailableClasses([...availableClasses, styleClass].sort(compareClasses));
	};

	return (
		<div>
			<FormLabel>Selected classes</FormLabel>
			<br />
			{
				selectedClasses?.map((styleClass: any) => (
					<Tag
					key={styleClass.name}
					filter
					onClose={() => deselectStyleClass(styleClass)}>
						{styleClass.name}
					</Tag>
				))
			}
			<br />
			<FormLabel>Available classes</FormLabel>
			<br />
			{
				availableClasses.map((styleClass: any) => (
					<Tag
					key={styleClass.name}
					onClick={() => selectStyleClass(styleClass)}>
						{styleClass.name}
					</Tag>
				))
			}
		</div>
	);
};

export const ComponentCssClassSelector = ({ componentObj, setComponent }: any) => {
	const setSelectedClasses = (cssClasses: any[], updateActionHistory = true) => {
		setComponent(
			{
				...componentObj,
				cssClasses
			},
			updateActionHistory
		);
	};

	return (
		<CssClassSelector
			selectedClasses={componentObj.cssClasses}
			setSelectedClasses={setSelectedClasses}
		/>
	);
};
