import React, { useState } from 'react';
import { Search, Button, Dropdown } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';
import * as Icons from '@carbon/icons-react';
import image from './../assets/component-icons/button.svg';
import { ElementTile } from '../components/element-tile';
import { Add16 } from '@carbon/icons-react';
import _ from 'lodash';
const searchStyle = css`
	margin-top: 15px;
`;

const elementTileListStyle = css`
	display: flex;
    justify-content: space-between;
	flex-wrap: wrap;
    margin-top: 20px;
`;

const elementTileStyle = css`
	border: 1px solid #d8d8d8;
	min-width: 34px;
	height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
	margin-bottom: 1rem;
    flex-direction: column;
`;

const sizeItems = [
    {id: '16', text: 'Small'},
    {id: '20', text: 'Medium'},
    {id: '24', text: 'Large'},
    {id: '32', text: 'Extra large'}
];




export const AIconsInputStyleUI = ({selectedComponent, setComponent}: any) => {
    const [filterString, setFilterString] = useState('');
    const shouldShow = (matches: string[]) => {
		return !filterString || matches.some((match) => match.includes(filterString));
    };
    let items: any = [];
    Object.entries(Icons).forEach(item => {        
        const element = item[0].split(/(\d+)/);
        const icon = element ? element[0] : '';
        const size = element ? element[1] : '';
        const object = {
            key: icon,
            children: item[1],
            compoenentObj: {
                keywords: [item[0], item[0].toLowerCase(), item[0].replace(/[0-9]/g, '')],
                size: [size],
                id: item[0],
                label: `${icon} `,
                type: 'icon',
                className: elementTileStyle
            }
        }
        if(item[0] !== 'Icon') {
            const isIncluded = items.some((item: any) => item.key === object.key);
            if(isIncluded) {
               const current = items.find((item: any) => item.key === object.key);
               current.compoenentObj.size.push(size);
            } else {
                items.push(object);
            }
        }
        selectedComponent.items = items;
    });
	return <>
        <Dropdown
            label='Size'
            titleText='Size'
            items={sizeItems}
            initialSelectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(event: any) => setComponent({
                ...selectedComponent,
                size: event.selectedItem.id
        })}/>
		<Search
		    id='icons-search'
			className={searchStyle}
			light
			labelText='Filter icons'
			placeholder='Filter icons'
			onChange={(event: any) => setFilterString(event.target.value)} />
        <div className={elementTileListStyle}>
            {
                 items.filter((component: any) => shouldShow(component.compoenentObj.keywords)).map((props: any) => 
                    <ElementTile componentObj={props.compoenentObj}
                    onChange={(event: any) => setComponent({
                        ...selectedComponent,
                        icon: event.selectedItem.id
                    })}>
                        <props.children></props.children>
                    </ElementTile>)
                 
            }
        </div>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
    </>
};
export const AIcons = ({
    componentObj,
	...rest
}: any) => {
    if(_.isEmpty(componentObj.selectedIcon)) { 
        componentObj.selectedIcon = Add16;
    }
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
                <Button kind="ghost">
                    <componentObj.selectedIcon></componentObj.selectedIcon>
                </Button>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AIcons,
    styleUI: AIconsInputStyleUI,
	keywords: ['icons'],
	name: 'Icons',
	defaultComponentObj: {
		type: 'icons',
        label: 'Icons',
        size: '16',
        selectedIcon: {},
        items: []
	},
	image,
	codeExport: {
		angular: {
			inputs: ({json}) => ``,
			outputs: (_) => ``,
			imports: [''],
			code: ({json}) => {
				return ``;
			}
		},
		react: {
			imports: [''],
			code: ({json}) => {
				return ``
			}
		}
	}
};