import React from 'react';
import {
    Button,
    Dropdown
} from 'carbon-components-react';
import { css } from 'emotion';
import { useFragment } from '../../context';
import { isPropertySignature } from 'typescript';
import { allComponents } from '../../fragment-components/index'

// TODO: Come up with a new name for file & Component
export const ActionsEditor = ({ signal, addAction }: any) => {
    const [fragment, setFragment] = useFragment();

    //*******************
    // Elements Dropdown
    //*******************

    // ***************
    // TODO: Use allComponents instead of the below array
    // ***************

    /**
     * Element types that are supported in actions
     * 
     * 
     */
    const actionSupportedElementTypes: string[] = [
		'button'
	];

    /**
     * ***Should use filter***
     * ***Create helper function***
     * 
     * Recursive function that pulls all the elements in the fragment that are compatible with actions
     * 
     * Depends on the 'actionSupportedElementTypes' array for selecting valid elements
     * 
     * @param actionableElements Array of codeContext.name values for elements that can have actions
     * @param items Recursive data structure, each item may have an array of items depending on the fragment design
     * @returns final value of actionableElements, all the codeContext.name values for elements of our fragment that support actions
     */
	const getActionableElements = (actionableElements: string[], items: any): string[] => {
		for(let i = 0; i < items.length; i++) {
			if(actionSupportedElementTypes.includes(items[i].type)) {
				actionableElements.push(items[i].codeContext.name);
			}

			if(items[i].items) {
				getActionableElements(actionableElements, items[i].items);
			}
		}

		return actionableElements;

	} 

	const actionableElements = getActionableElements([], fragment.data.items);
    const elementDropdownItems = actionableElements.map(element => ({ text: element }));


    //*******************
    // Slots Dropdown
    //*******************

    // TODO: Ideally should be implemented in AllComponents

    // Current feature set is just disabling buttons
    // Future state this dropdown will need to be dynamic
    // Will be dependant on what element is selected
    const slotDropdownItems: { text: string }[] = [
        { text: 'Toggle Disable' },
        // { text: 'Toggle Visibility' }
    ];    
    
    return <div className={css`border: 2px #525252 solid; padding: 10px; margin: 5px;`}>
        <h6 className={css`color: #323232, marginBottom: 5px; fontWeight: normal; textDecoration: underline;`}>{signal.text}</h6>
        <Dropdown
            id='elementDropdown'
            titleText='Element'
            helperText='Your existing elements'
            label=''
            items={elementDropdownItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(selectedItem: any) => {
                signal.destination = selectedItem
            }}
        />
        <Dropdown
            id='slotDropdown'
            titleText='Slot'
            helperText='What changes on the element'
            label=''
            items={slotDropdownItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(selectedItem: any) => {
                signal.slot = selectedItem
            }}
        />
        <Button kind='ghost' onClick={() => addAction(signal.text, signal.source, signal.signal)}>
            +
        </Button>
    </div>
}