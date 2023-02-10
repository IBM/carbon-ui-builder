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
export const ActionsPane = ({ action, addAction }: any) => {
    const [fragment, setFragment] = useFragment();

    //*******************
    // Elements Dropdown
    //*******************

    // Remove this helper array
    // Check for each action supported element type directly in recursive function
    const actionSupportedElementTypes: string[] = 
        Object.values(allComponents)
            .filter(component => component.componentInfo.signals)
            .map(component => component.componentInfo.type);
        
    
    /**
     * Uses searchForActionableElements to get elements that contain actions
     * 
     * @returns Array of actionable element names
     */
    const getActionableElements = (): string[] => searchForActionableElements([], fragment.data.items);

    /**
     * 
     * Recursive function that pulls all the elements in the fragment that are compatible with actions
     * 
     * Depends on the 'actionSupportedElementTypes' array for selecting valid elements
     * 
     * @param actionableElements Array of codeContext.name values for elements that can have actions
     * @param items Recursive data structure, each item may have an array of items depending on the fragment design
     * @returns final value of actionableElements, all the codeContext.name values for elements of our fragment that support actions
     */
	const searchForActionableElements = (actionableElements: string[], items: any): string[] => {
        for(let i = 0; i < items.length; i++) {
			if(actionSupportedElementTypes.includes(items[i].type)) {
				actionableElements.push(items[i].codeContext.name);
			}

			if(items[i].items) {
				searchForActionableElements(actionableElements, items[i].items);
			}
		}

		return actionableElements;

	} 

	const actionableElements = getActionableElements();
    const elementDropdownItems = actionableElements.map(element => ({ text: element }));

    //*******************
    // Slots Dropdown
    //*******************

    // TODO: Ideally should be implemented using AllComponents
    // Current feature set is just disabling buttons so this implementation fits
    // Future state this dropdown will need to be dynamic
    // Using AllComponents, check what slots are available for the selected element 

    // const slotDropdownItems: string[] = [];
    const slotDropdownItems: { text: string }[] = [
        { text: 'Toggle Disable' },
        // { text: 'Toggle Visibility' }
    ];    

    const elementSelected = (element: any) => {
        // Current set of actions - but we remove the target action that we're changing
        const newActions = fragment.data.actions.filter((element: any) => element.id != action.id);

        // Add the target action back with destination property
        newActions.push({ 	
            text: action.signal, // TODO: need a way to get title with proper captialization
            source: action.source, 
            signal: action.signal,
            destination: element.selectedItem.text, 
            slot: '',
            id: action.id,
        });

        setFragment({...fragment, data: {
            ...fragment.data, actions: newActions
        }});
    } 

    const slotSelected = (slot: any) => {
        // Current set of actions - but we remove the target action that we're changing
        const newActions = fragment.data.actions.filter((element: any) => element.id != action.id);

        // Add the target action back with destination property
        newActions.push({ 	
            text: action.signal, // TODO: need a way to get title with proper captialization
            source: action.source, 
            signal: action.signal,
            destination: action.destination, 
            slot: slot.selectedItem.text,
            id: action.id,
        });

        // TODO: Check other setFragments to format like below
        setFragment({
            ...fragment, 
            data: {
                ...fragment.data, 
                actions: newActions
            }
        });
    }
    
    return <div className={css`border: 2px #525252 solid; padding: 10px; margin: 5px;`}>
        <h6 className={css`color: #323232; marginBottom: 5px; fontWeight: normal; textDecoration: underline;`}>{action.text}</h6>
        <Dropdown
            id='elementDropdown'
            titleText='Element'
            label=''
            items={elementDropdownItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(element: any) => elementSelected(element)}
        />
        <Dropdown
            id='slotDropdown'
            titleText='Slot'
            label=''
            items={slotDropdownItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(slot: any) => slotSelected(slot)}
        />
        <Button kind='ghost' onClick={() => addAction(action.text, action.source, action.signal)}>
            +
        </Button>
    </div>
}