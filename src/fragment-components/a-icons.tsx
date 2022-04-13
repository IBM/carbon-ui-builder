import React, { useState } from 'react';
import { Search, Dropdown } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';
import * as Icons from '@carbon/icons-react';
import image from './../assets/component-icons/icons.svg';
import { ElementTile } from '../components/element-tile';
import _ from 'lodash';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';
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
	{ id: '16', text: 'Small' },
	{ id: '20', text: 'Medium' },
	{ id: '24', text: 'Large' },
	{ id: '32', text: 'Extra large' }
];

const getIcons = () => {
	let items: any = [];
	Object.entries(Icons).forEach((item: any) => {
		const element = item[0].split(/(\d+)/);
		const icon = element ? element[0] : '';
		const size = element ? element[1] : '';
		const object = {
			key: icon,
			componentObj: {
				keywords: [item[0], item[0].toLowerCase(), item[0].replace(/[0-9]/g, '')],
				size: [{ size: size, text: sizeItems.find((sizeItem: any) => sizeItem.id === size)?.text, component: item[1] }],
				key: icon,
				label: `${icon}`,
				name: item[1].render.name,
				type: 'icons',
				className: elementTileStyle,
				selectedIcon: item[1],
				selectedSize: size
			}
		};
		if(item[0] !== 'Icon') {
			const isIncluded = items.some((item: any) => item.key === object.key);
			if(isIncluded) {
				const current = items.find((item: any) => item.key === object.key);
				current.componentObj.size.push({ size: size,
					text: sizeItems.find((sizeItem: any) => sizeItem.id === size)?.text, component: item[1] });
			} else {
				items.push(object);
			}
		}
	});
	return items;
};

export const AIconsInputStyleUI = ({ selectedComponent, setComponent }: any) => {
	const [filterString, setFilterString] = useState('');
	const shouldShow = (matches: string[]) => {
		return !filterString || matches.some((match) => match.includes(filterString));
	};
	return (<>
        <Dropdown
        label='Size'
        titleText='Size'
        items={selectedComponent.size}
        initialSelectedItem={selectedComponent.size.find((item: any) => item.size === selectedComponent.size[0].size)}
        itemToString={(item: any) => (item ? item.text : '')}
        onChange={(event: any) => setComponent({
                ...selectedComponent,
                selectedIcon: selectedComponent.size.find((item: any) => item.size === event.selectedItem.size).component,
                selectedSize: selectedComponent.size.find((item: any) => item.size === event.selectedItem.size).size
        })}/>
		<Search id='icons-search'
			className={searchStyle}
			light
			labelText='Filter icons'
			placeholder='Filter icons'
			onChange={(event: any) => setFilterString(event.target.value)} />
        <div className={elementTileListStyle}>
            {
                 selectedComponent.items.filter((component: any) => shouldShow(component.componentObj.keywords)).map((props: any) => {
                    const Component = props.componentObj.selectedIcon;
                   // eslint-disable-next-line react/jsx-key
                   return (<ElementTile componentObj={props.componentObj}>
                                <Component
                                onClick={() => setComponent({
                                        ...selectedComponent,
                                        selectedIcon: props.componentObj.selectedIcon,
                                        key: props.componentObj.key,
                                        size: props.componentObj.size,
                                        name: props.componentObj.name
                                    })}>
                                </Component>
                            </ElementTile>);
                 })
            }
        </div>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>);
};
export const AIcons = ({
	componentObj,
	...rest
}: any) => {
	componentObj.items = getIcons();
	const component = componentObj.key === '' ?
		componentObj.items.find((item: any) => item.key === 'Add').componentObj :
		componentObj.items.find((item: any) => item.key === componentObj.key).componentObj;
	if(_.isEmpty(componentObj.selectedIcon)) {
		componentObj.selectedIcon = component.selectedIcon;
		componentObj.key = component.key;
		componentObj.size = component.size;
		componentObj.name = component.name;
		componentObj.selectedSize = component.selectedSize;
	}
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
            <componentObj.selectedIcon></componentObj.selectedIcon>
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
		size: '',
		key: '',
		name: '',
		selectedSize: ''
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['IconModule'],
			code: ({ json }) => {
				return `<svg
                            ${json.selectedSize ? `size='${json.selectedSize}'` : '16'}
                            ${json.name ? `ibmIcon='${json.key}'` : ''}
                            ${angularClassNamesFromComponentObj(json)}>
                        </svg>`;
			}
		},
		react: {
			imports: [''],
			otherImports: ({ json }) => {
				return `import {${json.name}} from "@carbon/icons-react";`;
			},
			code: ({ json }) => {
				return `<${json.name} 
                            ${json.key ? `aria-label='${json.key}'` : ''}
                        ${reactClassNamesFromComponentObj(json)}/>`;
			}
		}
	}
};
