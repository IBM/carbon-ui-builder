import React, { useState } from 'react';
import { Search, Button, Dropdown } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';
import * as Icons from '@carbon/icons-react';
import image from './../assets/component-icons/button.svg';
import { ElementTile } from '../components/element-tile';
const searchStyle = css`
	margin-top: 15px;
`;

const elementTileListStyle = css`
	display: flex;
    justify-content: space-between;
	flex-wrap: wrap;
    margin-top: 20px;
`;

const titleStyle = css`
    height: 30px;
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
        const sizeText = sizeItems.find((item) => item.id === size)?.text;
        const object = {
            keywords: [item[0], item[0].toLowerCase(), item[0].replace(/[0-9]/g, '')],
            name: `${sizeText === undefined ? '' : sizeText} ${icon} `,
            size: size,
            icon: item[1],
            id: item[0]
        }
        if(item[0] !== 'Icon') items.push(object);
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
                 items.filter((component: any) => shouldShow(component.keywords)).map((props: any) => 
                    <ElementTile className={titleStyle} componentObj={props.icon}
                    onChange={(event: any) => setComponent({
                        ...selectedComponent,
                        icon: event.selectedItem.id
                    })}>
                        <span className={cx(css`font-size:10px`)}>{props.name}</span>
                        <props.icon></props.icon>
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
    let icons = Object.entries(Icons).find(icon => icon[0] === `${componentObj.selectedIcon+ componentObj.size}`);
    componentObj.icon = icons !== undefined ? icons[1] : '';
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
             
                <Button kind="ghost">
                  
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
        selectedIcon: 'Add',
        icon: ''
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