import React, { useEffect, useState } from 'react';
import { ComboBox, Dropdown } from '@carbon/react';
import { DraggableTileList } from '../helpers/draggable-list';
import { Action } from '@carbon-builder/ui-fragment';
import {
	actionDestinationsFromFragment,
	getComponentById,
	signalsFromType,
	slotsFromFragmentSignalAndDestination
} from '../helpers/tools';
import { css } from 'emotion';

const noClearSelectedStyle = css`
	.bx--list-box__selection, .cds--list-box__selection {
		display: none;
	}
`;

const ActionItem = ({ item, index, updateItem, fragment }: any) => {
	const [selectedSignal, setSelectedSignal] = useState(item.signal);
	const [selectedDestination, setSelectedDestination] = useState(item.destination);
	const [selectedSlot, setSelectedSlot] = useState(item.slot);

	useEffect(() => {
		// this useEffect updates item if all required elements are present
		if (!(selectedSignal && selectedDestination && selectedSlot)) {
			return;
		}

		updateItem({
			...item,
			signal: selectedSignal,
			destination: selectedDestination,
			slot: selectedSlot
		}, index);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSignal, selectedDestination, selectedSlot]);

	useEffect(() => {
		// update dropdowns if item changes
		setSelectedSignal(item.signal);
		setSelectedDestination(item.destination);
		setSelectedSlot(item.slot);
	}, [item]);

	// find all possible destinations in the fragment that have the compatible prop types with signal
	const destinationDropdownItems: any[] = actionDestinationsFromFragment(fragment, item);
	// find all slots in the selected destination that have compatible prop types with selected signal
	const slotDropdownItems: any[] = slotsFromFragmentSignalAndDestination(fragment, item.source, selectedSignal, selectedDestination);

	const component = getComponentById(fragment.data, item.source);
	const signalDropdownItems: any[] = signalsFromType(component.type).map((item: any) => ({ text: item }));

	useEffect(() => {
		if (signalDropdownItems.length === 1) {
			setSelectedSignal(signalDropdownItems[0].text);
		}
		if (slotDropdownItems.length === 1) {
			setSelectedSlot(slotDropdownItems[0]);
		}
	}, [signalDropdownItems, slotDropdownItems]);

	return (
		<>
			<Dropdown
				id='signalDropdown'
				size='sm'
				light={true}
				titleText='Signal'
				label=''
				items={signalDropdownItems}
				itemToString={(item: any) => (item ? item.text : '')}
				onChange={(element: any) => setSelectedSignal(element.selectedItem.text)}
				selectedItem={{ text: selectedSignal }}
			/>
			<ComboBox
				id='destinationDropdown'
				className={noClearSelectedStyle}
				size='sm'
				light={true}
				titleText='Destination'
				label=''
				items={destinationDropdownItems}
				itemToString={(item: any) => (item ? item.text : '')}
				onChange={(element: any) => setSelectedDestination(element.selectedItem.id)}
				selectedItem={{ text: selectedDestination }}
			/>
			<Dropdown
				id='slotDropdown'
				size='sm'
				light={true}
				titleText='Slot'
				label=''
				items={slotDropdownItems}
				itemToString={(item: any) => item}
				onChange={(element: any) => setSelectedSlot(element.selectedItem)}
				selectedItem={selectedSlot}
			/>
		</>
	);
};

export const ActionsConnector = ({ fragment, setFragment, sourceComponent }: any) => {
	// we use actionState so incomplete actions wouldn't make it to fragment
	const [actionState, _setActionState] = useState<Action[]>([]);

	const getOtherActions = () => fragment.data.actions
		? fragment.data.actions.filter((action: any) => !(sourceComponent && action.source === sourceComponent.id))
		: [];

	useEffect(() => {
		const relatedActions = fragment.data.actions
			? fragment.data.actions.filter((action: any) => sourceComponent && action.source === sourceComponent.id)
			: [];
		_setActionState(relatedActions);
	// setActionState handles the change on fragment.data.actions, and this would counteract that
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sourceComponent]);

	const setActionState = (state: Action[]) => {
		// this makes a difference and updates fragment when an action is removed or becomes incomplete
		setFragment({
			...fragment,
			data: {
				...fragment.data,
				actions: [
					...getOtherActions(),
					...state.filter((action: Action) => action.signal && action.slot && action.source && action.destination)
				]
			}
		});

		_setActionState(state);
	};

	const updateItem = (item: any, index: number) => {
		setFragment({
			...fragment,
			data: {
				...fragment.data,
				actions: [
					...getOtherActions(),
					...actionState.slice(0, index),
					item,
					...actionState.slice(index + 1)
				]
			}
		});
	};

	return (
		<DraggableTileList
			dataList={actionState}
			setDataList={setActionState}
			updateItem={updateItem}
			Template={ActionItem}
			extraTemplateProps={{ fragment }}
			defaultObject={{
				source: sourceComponent?.id,
				signal: '',
				destination: '',
				slot: ''
			}}
		/>
	);
};
