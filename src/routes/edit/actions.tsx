import { useEffect, useState } from 'react';

import { DraggableTileList } from '../../components';
/* eslint-disable react/react-in-jsx-scope */
// import React, { useEffect, useState } from 'react';
import {
	Dropdown
} from 'carbon-components-react';
// import { isPropertySignature } from 'typescript';
import { allComponents } from '../../fragment-components/index';
import { css } from 'emotion';
import { useFragment } from '../../context';

interface ActionProps {
	text: String;
	source: String;
	signal: String;
	destination: String;
	slot: String;
	id: Number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ActionsPane = ({ addAction, sourceComponent }: any) => {
	const [fragment, setFragment] = useFragment();

	// Collect the actions stored in the fragment that are relevant to the currently selected component
	const relatedActions = (fragment.data.actions) ? fragment.data.actions.filter((action: any) => action.source === sourceComponent.id) : [];

	// Create actionState, default value is the collection of related actions from the fragment
	const [actionState, setActionState] = useState<ActionProps[]>(relatedActions);

	// Remove this helper array
	// Check for each action supported element type directly in recursive function
	const actionSupportedElementTypes: string[] =
        Object.values(allComponents)
        	.filter(component => component.componentInfo.signals)
        	.map(component => component.componentInfo.type);

	/**
     *
     * Recursive function that pulls all the elements in the fragment that are compatible with actions
     *
     * Depends on the 'actionSupportedElementTypes' array for selecting valid elements
     *
     * @param actionableElements Array of codeContext.name values for elements that can have actions
     * @param items Recursive data structure, each item may have an array of items depending on the fragment design
     * @returns final value of actionableElements, all the codeContext.name values for elements of our fraxrgment that support actions
     */
	const searchForActionableElements = (actionableElements: string[], items: any): string[] => {
		items.forEach((item: any) => {
			if (actionSupportedElementTypes.includes(item.type)) {
				actionableElements = [
					...actionableElements,
					item.codeContext.name
				];
			}

			if (item.items) {
				actionableElements = searchForActionableElements(actionableElements, item.items);
			}

		});
		return actionableElements;

	};

	const actionableElements = searchForActionableElements([], fragment.data.items);
	console.log('actionableElements', actionableElements);
	const elementDropdownItems = actionableElements.map(element => ({ text: element }));

	// TODO: Ideally should be implemented using AllComponents
	// Current feature set is just disabling buttons so this implementation fits
	const slotDropdownItems: { text: string }[] = [
		{ text: 'Toggle Disable' }
		// { text: 'Toggle Visibility' }
	];

	const handleActionUpdate = (action: any, item: any, updateType: String) => {
		const filteredActions = actionState.map(currentAction => {
			if (currentAction.id === item.id) {
				if (updateType === 'actions') {
					currentAction.destination = action.selectedItem.text;
				} else if (updateType === 'slots') {
					currentAction.slot = action.selectedItem.text;
				}
			}
			return currentAction;
		});
		setActionState(filteredActions);
	};

	useEffect(() => {
		const completedActions = actionState.filter(currentAction => currentAction.destination !== '' && currentAction.slot !== '');
		const unrelatedActions = (fragment.data.actions) ? fragment.data.actions.filter((action: any) => action.source !== sourceComponent.id) : [];
		setFragment({
			...fragment,
			data: {
				...fragment.data,
				actions: [...unrelatedActions, ...completedActions]
			}
		});
	}, [actionState]);

	const updateActionsList = (newList: any[]) => {
		setActionState(newList);
	};

	const template = (item: any, _index: number) => {
		return (
			<>
            <h6 className={css`color: #323232; margin-bottom: 8px; font-weight: normal;`}>{item.text || 'New Action'}</h6>
            <Dropdown
            id='elementDropdown'
            className={css`margin-bottom: 1rem; background-color: #fff`}
            size='sm'
            titleText='Element'
            label=''
            items={elementDropdownItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(element: any) => handleActionUpdate(element, item, 'actions')}
            selectedItem={{ text: item.destination }}
            />
            <Dropdown
            id='slotDropdown'
            titleText='Slot'
            label=''
            items={slotDropdownItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(slot: any) => handleActionUpdate(slot, item, 'slots')}
            selectedItem={{ text: item.slot }}
            className={css`background-color: #fff`}
            />

			</>
		);
	};

	return (
    <DraggableTileList
    dataList={actionState}
    setDataList={updateActionsList}
    updateItem={handleActionUpdate}
    template={template}
    defaultObject={{
			text: 'On click',
			source: sourceComponent.id,
			signal: 'onclick',
			destination: '',
			slot: '',
			id: actionState.length
		}}
	/>
	);
};
