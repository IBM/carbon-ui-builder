import React, { useEffect } from 'react';
import {
	TextInput,
	Checkbox,
	SelectableTile
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css } from 'emotion';
import { useFragment } from '../../context';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '..';
import image from '../../assets/component-icons/tile-selectable.svg';
import {
	Adder,
	getParentComponent,
	updatedState
} from '../../components';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const ASelectableTileStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		{selectedComponent.standalone &&
			<TileMorphism component={selectedComponent} setComponent={setComponent} /> &&
			<Checkbox
				labelText='Light theme'
				id='theme-select'
				checked={selectedComponent.light}
				onChange={(checked: any) => {
					setComponent({
						...selectedComponent,
						light: checked
					});
				}}
			/>}
		<Checkbox
			labelText='Selected'
			id='selected'
			checked={selectedComponent.selected}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					selected: checked
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
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ASelectableTileCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						name: event.currentTarget.value
					}
				});
			}}
		/>
		<TextInput
			value={selectedComponent.codeContext?.title || ''}
			labelText='Title'
			placeholder='Title attribute'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						title: event.currentTarget.value
					}
				});
			}}
		/>
		<TextInput
			value={selectedComponent.codeContext?.value || ''}
			labelText='Value'
			placeholder='Tile value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						value: event.currentTarget.value
					}
				});
			}}
		/>
	</>
};

// Prevent users from clicking on the selectable tile
const preventCheckEvent = css`
	pointer-events: none;
	.bx--tile-content {
		pointer-events: initial;
	}
`;

export const ASelectableTile = ({
	children,
	componentObj,
	onDrop,
	selected,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addTile = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					standalone: false,
					type: 'selectabletile',
					codeContext: {
						formItemName: componentObj.codeContext?.formItemName
					},
					...(componentObj.light !== undefined ? { light: componentObj.light } : ''),
					items: [{ type: 'text', text: 'New selectable tile' }]
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	// Removing `for` attribute so users can select text and other non-form elements.
	useEffect(() => {
		const tileElement = document.getElementById(componentObj.codeContext.name);
		const labelElement = tileElement?.parentElement?.querySelector('label.bx--tile.bx--tile--selectable');
		// Setting to empty instead of removing so users can select non-form elements within tile when a form element is present
		// Although form elements should never be added within another
		labelElement?.setAttribute('for', '');
	}, [componentObj.codeContext]);

	return (
		<Adder
			active={parentComponent.tileGroup && selected}
			topAction={() => addTile()}
			bottomAction={() => addTile(1)}
			key={componentObj.id}>
			<AComponent
				componentObj={componentObj}
				headingCss={css`display: block;`}
				className={css`cursor: pointer;`}
				selected={selected}
				{...rest}>
					<SelectableTile
					id={componentObj.codeContext?.name}
					title={componentObj.title}
					value={componentObj.value}
					light={componentObj.light}
					selected={componentObj.selected}
					disabled={componentObj.disabled}
					className={`${preventCheckEvent} ${componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}`}
					onDrop={onDrop}>
						{children}
					</SelectableTile>
			</AComponent>
		</Adder>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASelectableTile,
	styleUI: ASelectableTileStyleUI,
	codeUI: ASelectableTileCodeUI,
	keywords: ['tile', 'card', 'multi', 'selectable'],
	name: 'Selectable tile',
	defaultComponentObj: {
		type: 'selectabletile',
		standalone: true,
		disabled: false,
		selected: false,
		items: [
			{ type: 'text', text: 'A standalone selectable tile' }
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <ASelectableTile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
			{componentObj.items.map((item: any) => renderComponents(item))}
	</ASelectableTile>,
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Selected = ${json.selected || false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = '${json.value}';`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Change = new EventEmitter<Event>();`,
			imports: ['TilesModule'],
			code: ({ json, jsonToTemplate }) => {
				/**
				 * @todo - CCA does not support light & disabled
				 * https://github.com/IBM/carbon-components-angular/issues/1999
				 */
				return `<ibm-selection-tile
					[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
					[selected]="${nameStringToVariableString(json.codeContext?.name)}Selected"
					${json.standalone ? `(change)="${nameStringToVariableString(json.codeContext?.name)}Change.emit($event)"` : ''}
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element)).join('\n')}
					</ibm-selection-tile>`
			}
		},
		react: {
			imports: ['SelectableTile'],
			code: ({ json, jsonToTemplate, fragments }) => {
				/**
				 * @todo
				 * This is a temporary solution until selectable tile gets a `TileGroup` parent
				 * that can return a meaning event onChange
				 */
				const stateFunction = json.standalone ?
					`() => {
						handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: "${json.codeContext?.value}"
							}
				})}` :
					`() => {
						const obj = { ...state["${json.codeContext?.formItemName}"] };
						if (obj["${json.codeContext?.name}"] !== undefined) {
							delete obj["${json.codeContext?.name}"];
						} else {
							obj["${json.codeContext?.name}"] = "${json.codeContext?.value}";
						}

						handleInputChange({
							target: {
								name: "${json.codeContext?.formItemName}",
								value: obj
							}
						});
					}`;

				return `<SelectableTile
					id="${json.codeContext?.name}"
					${(json.codeContext?.value !== undefined && json.codeContext?.value !== '') ? `value="${json.codeContext?.value}"` : ''}
					${(json.codeContext?.title !== undefined && json.codeContext?.title !== '') ? `title="${json.codeContext?.title}"` : ''}
					${(json.codeContext?.formItemName !== undefined && !json.standalone) ? `name="${json.codeContext?.formItemName}"` : `name="${json.codeContext?.name}"`}
					${json.selected !== undefined ? `selected={${json.selected}}` : ''}
					${json.light !== undefined ? `light={${json.light}}` : ''}
					${json.disabled !== undefined && !!json.disabled ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}
					onClick={${stateFunction}}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</SelectableTile>`;
			}
		}
	}
};
