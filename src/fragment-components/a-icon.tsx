import React, { useState } from 'react';
import { Search, Dropdown, ModalWrapper } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentInfo } from '.';
import * as Icons from '@carbon/icons-react';
import image from './../assets/component-icons/icons.svg';
import { ElementTile } from '../components/element-tile';
import isEmpty from 'lodash/isEmpty';
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
	const items: any = [];
	Object.entries(Icons).forEach((item: any) => {
		const element = item[0].split(/(\d+)/);
		const icon = element ? element[0] : '';
		const size = element ? element[1] : '';
		const iconItem = {
			key: icon,
			componentObj: {
				keywords: [item[0], item[0].toLowerCase(), item[0].replace(/[0-9]/g, '')],
				// size list for each selected icon is used in the Sizes dropdown
				size: [{ size: size, text: sizeItems.find((sizeItem: any) => sizeItem.id === size)?.text, component: size }],
				key: icon,
				label: String(icon),
				name: item[1].render.name,
				type: 'icons',
				// custom tile class for tiles in the modal
				className: elementTileStyle,
				selectedIcon: item[1],
				selectedSize: size
			}
		};
		if (item[0] !== 'Icon') {
			const isIncluded = items.some((item: any) => item.key === iconItem.key);
			if (isIncluded) {
				const current = items.find((item: any) => item.key === iconItem.key);
				current.componentObj.size.push({ size: size,
					text: sizeItems.find((sizeItem: any) => sizeItem.id === size)?.text, component: size });
			} else {
				// push the icons into a list which is displayed in the modal
				items.push(iconItem);
			}
		}
	});
	return items;
};

export const AIconSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const [filterString, setFilterString] = useState('');
	const shouldShow = (matches: string[]) => {
		return !filterString || matches.some((match) => match.includes(filterString));
	};
	return (<>
		<Dropdown
		className={css`margin-bottom: 1rem;`}
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
		<ModalWrapper
		buttonTriggerText="More icons"
		modalHeading="Select an icon"
		modalLabel="Icons"
		passiveModal>
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
										className={css`cursor: pointer;`}
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
		</ModalWrapper>
	</>);
};
export const AIcon = ({
	componentObj,
	...rest
}: any) => {
	componentObj.items = getIcons();
	const component = componentObj.key === '' ?
		componentObj.items.find((item: any) => item.key === 'Add').componentObj :
		componentObj.items.find((item: any) => item.key === componentObj.key).componentObj;
	if (isEmpty(componentObj.selectedIcon)) {
		componentObj.selectedIcon = component.selectedIcon;
		componentObj.key = component.key;
		componentObj.size = component.size;
		componentObj.name = component.name;
		componentObj.selectedSize = component.selectedSize;
	}
	return (
		<AComponent
		rejectDrop={true}
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
			<componentObj.selectedIcon></componentObj.selectedIcon>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AIcon,
	settingsUI: AIconSettingsUI,
	keywords: ['icon'],
	name: 'Icon',
	type: 'icon',
	defaultComponentObj: {
		type: 'icon',
		label: 'Icon',
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
