import React, { useEffect } from 'react';
import { TextInput, Checkbox } from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { getParentComponent, updatedState } from '../../components';
import { css } from 'emotion';
import { useFragment } from '../../context';
import { ComponentInfo } from '../';

import image from '../../assets/component-icons/tile-radio.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const ARadioTileGroupSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TileMorphism component={selectedComponent} setComponent={setComponent} />
		<TextInput
			value={selectedComponent.legend}
			labelText='Legend name'
			placeholder='Fieldset header'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					legend: event.currentTarget.value
				});
			}}
		/>
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => {
				/**
				 * It usually is not common for users to have different theme for each tile,
				 * this approach will ensure users don't have to go through each child `tile` & update theme
				 */
				setComponent({
					...selectedComponent,
					light: checked,
					items: selectedComponent.items.map((tile: any) => ({
						...tile,
						light: checked
					}))
				});
			}}
		/>
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}}
		/>
	</>;
};

export const ARadioTileGroupCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
		value={selectedComponent.codeContext?.name}
		labelText='Input name'
		onChange={(event: any) => {
			setComponent({
				...selectedComponent,
				codeContext: {
					...selectedComponent.codeContext,
					name: event.currentTarget.value
				},
				// Radio form elements within a fieldset should have the same name
				items: selectedComponent.items.map((tile: any) => ({
					...tile,
					codeContext: {
						...tile.codeContext,
						// Radio Tiles (Children) use formItemName
						formItemName: event.currentTarget.value
					}
				}))
			});
		}}
	/>;
};

export const ARadioTileGroup = ({
	children,
	componentObj,
	selected,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();

	// Initialize the child tiles with the form item name
	// We use the name property because it's unique by default
	useEffect(() => {
		const parentComponent = getParentComponent(fragment.data, componentObj);
		const componentIndex = parentComponent.items.indexOf(componentObj);
		const items = [
			...parentComponent.items.slice(0, componentIndex),
			{
				...componentObj,
				items: componentObj.items.map((tile: any) => ({
					...tile,
					codeContext: { ...tile.codeContext, formItemName: componentObj.codeContext?.name }
				}))
			},
			...parentComponent.items.slice(componentIndex + 1)
		];
		setFragment({
			...fragment,
			data: updatedState(fragment.data, {
				type: 'update',
				component: {
					...parentComponent,
					items
				}
			})
		}, false);
		// Disabling since we want to call this only once to initialize children `formItemName` attribute in code context
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AComponent
			componentObj={componentObj}
			headingCss={css`display: block;`}
			selected={selected}
			{...rest}>
				<fieldset
				className={`bx--tile-group ${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}`}
				disabled={componentObj.disabled}>
					{(componentObj.legend !== undefined && componentObj.legend !== '') &&
					<legend className="bx--label">
						{componentObj.legend}
					</legend>}
					{children}
				</fieldset>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARadioTileGroup,
	settingsUI: ARadioTileGroupSettingsUI,
	codeUI: ARadioTileGroupCodeUI,
	keywords: ['tile', 'card', 'radio', 'select'],
	name: 'Radio tile group',
	type: 'radio-tile-group',
	defaultComponentObj: {
		type: 'radio-tile-group',
		tileGroup: true,
		legend: 'Radio Tile Group',
		items: [
			{
				type: 'radio-tile',
				defaultChecked: false,
				codeContext: {
					value: 'Tile 1'
				},
				items: []
			},
			{
				type: 'radio-tile',
				defaultChecked: false,
				codeContext: {
					value: 'Tile 2'
				},
				items: []
			},
			{
				type: 'radio-tile',
				defaultChecked: false,
				codeContext: {
					value: 'Tile 3'
				},
				items: []
			}
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline }) => <ARadioTileGroup
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
			{componentObj.items.map((tile: any) => renderComponents(tile, outline))}
	</ARadioTileGroup>,
	image,
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter<Event>();`,
			imports: ['TilesModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ibm-tile-group
					(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
					[multiple]="false"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ibm-tile-group>`;
			}
		},
		react: {
			imports: ['TileGroup'],
			code: ({ json, jsonToTemplate, fragments }) => {
				return `<TileGroup
					${json.legend !== undefined && json.legend !== '' ? `legend="${json.legend}"` : ''}
					name="${json.codeContext?.name}"
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}
					onChange={(radio) => handleInputChange({
						target: {
							name: "${json.codeContext?.name}",
							value: radio
						}
					})}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</TileGroup>`;
			}
		}
	}
};
