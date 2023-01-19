import React from 'react';
import {
    Button,
    Dropdown
} from 'carbon-components-react';
import { css } from 'emotion';

export const ActionsEditor = ({ text, value }: any) => {

    const actionChange = (data: { target: { name: string; value: any } }) => {
        // console.log('CONNOR selectedComponent:', selectedComponent);
        // console.log('CONNOR setComponent:', setComponent);
        console.log('CONNOR data', data);
    };


    // Should be dynamic
    // Should depend on the target element
    // Should only list the compatible slot actions
    const slotDropdownItems: { text: string }[] = [
        { text: 'Toggle Disable' },
        { text: 'Toggle Visibility' }
    ];

    // Should be dynamic
    // Should give a list of elements in current app that can be used as slots
    const elementDropdownItems: { text: string }[] = [
        { text: 'Button' }
    ];


    return <div className={css`border: 2px #525252 solid; padding: 10px; margin: 5px;`}>
        <h6 className={css`color: #323232, marginBottom: 5px; fontWeight: normal; textDecoration: underline;`}>{text}</h6>
        <Dropdown
            id='elementDropdown'
            titleText='Element'
            helperText='Your existing elements'
            label=''
            items={elementDropdownItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(selectedItem: any) =>
                actionChange({
                    target: {
                        name: 'elementDropdown',
                        value: selectedItem
                    }
                })
            }
        />
        <Dropdown
            id='slotDropdown'
            titleText='Slot'
            helperText='What changes on the element'
            label=''
            items={slotDropdownItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(selectedItem: any) =>
                actionChange({
                    target: {
                        name: 'slotDropdown',
                        value: selectedItem
                    }
                })
            }
        />
        <Button kind='ghost'>
            +
        </Button>
    </div>
}