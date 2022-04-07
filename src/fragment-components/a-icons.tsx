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
            componentObj: {
                keywords: [item[0], item[0].toLowerCase(), item[0].replace(/[0-9]/g, '')],
                size: [{size: size, component: item[1]}],
                id: icon,
                label: `${icon}`,
                type: 'icons',
                className: elementTileStyle,
                selectedIcon: item[1]
            }
        }
        if(item[0] !== 'Icon') {
            const isIncluded = items.some((item: any) => item.key === object.key);
            if(isIncluded) {
               const current = items.find((item: any) => item.key === object.key);
               current.componentObj.size.push({size: size, component: item[1]});
            } else {
                items.push(object);
            }
        }
    });
    const getSize = () => {
        return items.find((item: any) => item.key === selectedComponent.id).componentObj?.size?.map((sizeKey: any) => {
            return {
                id: sizeKey.size,
                text: sizeItems.find((size : any) => size.id === sizeKey.size)?.text,
                component: sizeKey.component
            }
        });
    }
 
	return <>
        <Dropdown
            label='Size'
            titleText='Size'
            items={getSize()}
            initialSelectedItem={getSize().find((item: any) => item.id === selectedComponent.size)}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={(event: any) => setComponent({
                ...selectedComponent,
                selectedIcon: getSize().find((item: any) => item.id === event.selectedItem.id).component
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
                 items.filter((component: any) => shouldShow(component.componentObj.keywords)).map((props: any) => {
                     const Component = props.componentObj.selectedIcon;
                   return (<ElementTile componentObj={props.componentObj}>
                                <Component 
                                    onClick={() => setComponent({
                                        ...selectedComponent,
                                        selectedIcon: props.componentObj.selectedIcon,
                                    })}>
                                </Component>
                            </ElementTile>)
                 })
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
        componentObj.id = 'Add';
        componentObj.size = '16';
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
        id: '',
        selectedIcon: {},
        allIcons: []
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