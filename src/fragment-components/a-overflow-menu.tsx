import React from 'react';
import {
	Checkbox,
	Dropdown,
	OverflowMenu,
	TextInput,
	OverflowMenuItem
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/overflowMenu.svg';
import { reactClassNamesFromComponentObj,
	angularClassNamesFromComponentObj,
	nameStringToVariableString } from '../utils/fragment-tools';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { DraggableTileList } from '../components';
import { css } from 'emotion';

const preventCheckEvent = css`
	pointer-events: none;
`;
export const AOverflowMenuSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const placementItems = [
		{ id: 'top', text: 'Top' },
		{ id: 'bottom', text: 'Bottom' }
	];

	const handleStepUpdate = (key: string, value: any, index: number) => {
		const step = {
			...selectedComponent.items[index],
			[key]: value
		};

		setComponent({
			...selectedComponent,
			items: [
				...selectedComponent.items.slice(0, index),
				step,
				...selectedComponent.items.slice(index + 1)
			]
		});
	};

	const template = (item: any, index: number) => {
		return <>
			<TextInput
				light
				value={item.itemText}
				labelText='Label'
				onChange={(event: any) => {
					handleStepUpdate('itemText', event.currentTarget.value, index);
				}}
			/>
			<TextInput
				light
				value={item.link}
				disabled= {!item.hasLink}
				labelText='Link'
				onChange={(event: any) => {
					handleStepUpdate('link', event.currentTarget.value, index);
				}}
			/>
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				<Checkbox
					labelText='Has link'
					id={`hasLink-${index}`}
					checked={item.hasLink}
					onChange={(checked: boolean) => handleStepUpdate('hasLink', checked, index) }/>
				<Checkbox
					labelText='Disabled'
					id={`disabled-${index}`}
					checked={item.disabled}
					onChange={(checked: boolean) => handleStepUpdate('disabled', checked, index)}/>
				<Checkbox
					labelText='Is delete'
					id={`isDelete-${index}`}
					checked={item.isDelete}
					onChange={(checked: boolean) => handleStepUpdate('isDelete', checked, index)} />
				<Checkbox
					labelText='has divider'
					id={`hasDivider-${index}`}
					checked={item.hasDivider}
					onChange={(checked: boolean) => handleStepUpdate('hasDivider', checked, index)} />
			</div>
		</>;
	};
	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};

	return <>
	<Dropdown
			label='Placement'
			titleText='Placement'
			items={placementItems}
			initialSelectedItem={placementItems.find(item => item.id === selectedComponent.placement)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				placement: event.selectedItem.id
			})} />
	<Checkbox
			labelText='Flip'
			id='flipped'
			checked={selectedComponent.flipped}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				flipped: checked
		})} />
	<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={handleStepUpdate}
			defaultObject={{
				itemText: 'New Option',
				disabled: false,
				hasLink: false,
				isDelete: false,
				hasDivider: false,
				link: ''
			}}
			template={template} />
	<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent}/>
	</>;
};

export const AOverflowMenuGroup = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
				<OverflowMenu
						flipped={componentObj.flipped}
						direction={componentObj.placement}
						className={` ${preventCheckEvent} ${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')} `}>
							{
							componentObj.items.map((step: any, index: number) => (
								<OverflowMenuItem
									className={step.className}
									href={step.hasLink ? step.link : undefined}
									itemText={step.itemText}
									disabled={step.disabled}
									isDelete={step.isDelete}
									key={index} />))
							}
				</OverflowMenu>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AOverflowMenuGroup,
	settingsUI: AOverflowMenuSettingsUI,
	keywords: ['overflow', 'menu', 'context'],
	name: 'Overflow menu',
	type: 'overflow-menu',
	defaultComponentObj: {
		isDelete: false,
		flipped: false,
		placement: 'bottom',
		type: 'overflow-menu',
		items: [
			{
				itemText: 'Option 1',
				className: 'option-1',
				disabled: false,
				hasLink: false,
				isDelete: false,
				hasDivider: false,
				link: ''
			}
		]
	},
	image: image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Flipped = ${json.flipped};
									@Input() ${nameStringToVariableString(json.codeContext?.name)}Placement = "${json.placement}";`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter();
							@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
			imports: ['DialogModule'],
			code: ({ json }) => {
				return `<ibm-overflow-menu
							[placement]="${nameStringToVariableString(json.codeContext?.name)}Placement"
							[flip]="${nameStringToVariableString(json.codeContext?.name)}Flipped"
							${angularClassNamesFromComponentObj(json)}>
								${json.items.map((step: any) => (
								`<ibm-overflow-menu-option
									${step.isDelete ? "type='danger'" : ''}
									${step.hasDivider ? `[divider]="${step.hasDivider}"` : ''}
									${step.hasLink ? `href="${step.link}"` : ''}
									${step.disabled ? `disabled="${step.disabled}"` : '' }
									(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)" 
									(click)="${nameStringToVariableString(json.codeContext?.name)}Clicked.emit($event)">
										${step.itemText}
							</ibm-overflow-menu-option>`
							)).join('\n')}
						</ibm-overflow-menu>`;
			}
		},
		react: {
			imports: ['OverflowMenu', 'OverflowMenuItem'],
			code: ({ json }) => {
				return `<OverflowMenu
							direction="${json.placement}"
							flipped={${json.flipped}}
							${reactClassNamesFromComponentObj(json)}>
							${json.items.map((step: any) => (
								`<OverflowMenuItem 
									${step.hasLink ? `href="${step.link}"` : ''}
									${step.isDelete !== undefined ? `isDelete={${step.isDelete}}` : ''}
									${step.hasDivider !== false ? 'hasDivider': ''}
									disabled={${step.disabled}}
									itemText="${step.itemText}"/>`
							)).join('\n')}
						</OverflowMenu>`;
			}
		}
	}
};
