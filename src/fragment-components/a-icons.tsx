import React, { useState } from 'react';
import { Search, Button, Dropdown } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo, allComponents } from '.';
import { allIcons } from './a-allIcons';
import { Add32 } from '@carbon/icons-react';
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
	width: 270px;
`;
const sizeItems = [
    {id: 'sm', text: 'Small'},
    {id: 'md', text: 'Medium'},
    {id: 'lg', text: 'Large'},
    {id: 'xl', text: 'Extra large'}
];

export const AIconsInputStyleUI = ({selectedComponent, setComponent}: any) => {
    const [filterString, setFilterString] = useState('');
    const shouldShow = (matches: string[]) => {
		return !filterString || matches.some((match) => match.includes(filterString));
    };

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
                Object.values(allComponents)
                .filter((component: any) =>
                    shouldShow(component.componentInfo.keywords))
                .map((component: any) =>
                <ElementTile componentObj={component.componentInfo.defaultComponentObj}>
                    <img src={component.componentInfo.image} alt={component.componentInfo.name} />
                    <span className='title'>{component.componentInfo.name}</span>
                </ElementTile>)
            }
        </div>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
    </>
};

const Icon = (selectedIcon: any) => {
    return React.createElement(selectedIcon.icon,
    {
        size: sizeItems.find(item => item.id === selectedIcon.selectedSize),
        disabled: selectedIcon.disabled
    })
}

export const AIcons = ({
    componentObj,
	...rest
}: any) => {
    componentObj.selectedIcon = allIcons.find(item => 
        item.id === "Add" && item.size === componentObj.size)?.icon;
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
           <Button kind="ghost">
                <Icon
                    icon = {componentObj.selectedIcon}
                    size= {componentObj.size}>
                </Icon>
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
        size: 'sm',
        selectedIcon: Add32
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