import React, { useRef } from 'react';
import {
	Tabs,
	Tab,
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from '../assets/component-icons/tabs.svg';
import { DraggableTileList } from '../components/draggable-list';
import { useFragment } from '../context';
import { updatedState } from '../components';
import { APlaceholder } from './a-placeholder';
import { cx } from 'emotion';
import {
	reactClassNamesFromComponentObj,
	angularClassNamesFromComponentObj,
	nameStringToVariableString
} from '../utils/fragment-tools';

export const ATabsSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const updateListItems = (key: string, value: any, index: number) => {
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
				id='tab-label'
				light
				value={item.labelText}
				labelText='Tab Label'
				onChange={(event: any) => {
					updateListItems('labelText', event.currentTarget.value, index);
				}} />
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				<Checkbox
					labelText='Disabled'
					id={`disabled-${index}`}
					checked={item.disabled}
					onChange={(checked: boolean) => updateListItems('disabled', checked, index)} />
			</div>
		</>;
	};

	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};

	return <DraggableTileList
		dataList={[...selectedComponent.items]}
		setDataList={updateStepList}
		updateItem={updateListItems}
		defaultObject={{
			type: 'tab',
			labelText: 'New tab',
			disabled: false,
			items: []
		}}
		template={template} />;
};

export const ATabsCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	id="input-name"
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
/>;

export const ATabs = ({
	children,
	componentObj,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();
	const holderRef = useRef(null as any);

	return (
		<AComponent
		rejectDrop={true}
		componentObj={componentObj}
		{...rest}>
			<Tabs className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{
					componentObj.items.map((step: any, index: number) => <Tab
						onClick= {() => componentObj.selectedTab = index}
						className={cx(step.className, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
						label={step.labelText}
						disabled={step.disabled}
						key={index}>
						{
							<section ref={holderRef} onDrop={(event) => {
								event.stopPropagation();
								event.preventDefault();
								const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));
								const items = componentObj.items.map((item: any, index: any) => {
									if (index === componentObj.selectedTab) {
										return {
											...step,
											items: [
												...step.items,
												dragObj.component
											]
										};
									}
									return item;
								});
								setFragment({
									...fragment,
									data: updatedState(fragment.data, {
										type: 'update',
										component: {
											...componentObj,
											items
										}
									})
								}, false);
							}}>
								{
									step.items && step.items.length > 0
									? children.filter((child: any, index: any) => index === componentObj.selectedTab)
									: <APlaceholder componentObj={step} select={rest.select} />
								}
							</section>
						}
					</Tab>)
				}
			</Tabs>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATabs,
	settingsUI: ATabsSettingsUI,
	codeUI: ATabsCodeUI,
	render: ({ componentObj, select, selected, remove, renderComponents, outline }) => <ATabs
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
		{
			componentObj.items.map((tab: any) => {
				if (tab.items && tab.items.length > 0) {
					return tab.items.map((item: any) => {
						return renderComponents(item, outline);
					});
				} return [];
			})
		}
	</ATabs>,
	keywords: ['tabs', 'tab'],
	name: 'Tabs',
	type: 'tabs',
	defaultComponentObj: {
		type: 'tabs',
		selectedTab: 0,
		items: [
			{
				type: 'tab',
				labelText: 'Tab 1',
				disabled: false,
				items: []
			},
			{
				type: 'tab',
				labelText: 'Tab 2',
				disabled: false,
				items: []
			},
			{
				type: 'tab',
				labelText: 'Tab 3',
				disabled: false,
				items: []
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}FollowFocus = true;
				@Input() ${nameStringToVariableString(json.codeContext?.name)}CacheActive = false;
				@Input() ${nameStringToVariableString(json.codeContext?.name)}isNavigation = true;`,
			outputs: () => '',
			imports: ['TabsModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ibm-tabs
					[cacheActive]="${nameStringToVariableString(json.codeContext?.name)}CacheActive"
					[followFocus]="${nameStringToVariableString(json.codeContext?.name)}FollowFocus"
					[isNavigation]="${nameStringToVariableString(json.codeContext?.name)}isNavigation"
					${angularClassNamesFromComponentObj(json)}>
					${json.items.map((step: any) => `<ibm-tab
						heading="${step.labelText}"
						[disabled]=${step.disabled}>
							${step.items && step.items.length > 0
								? `<section>
									${step.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
								</section>`
							: ''}
						</ibm-tab>`
					).join('\n')}
				</ibm-tabs>`;
			}
		},
		react: {
			imports: ['Tabs', 'Tab'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<Tabs
				${reactClassNamesFromComponentObj(json)}>
				${json.items.map((step: any, index: any) => `<Tab
					onClick={(index) => handleInputChange({
						target: {
							selectedTab: ${index}
						}
					})}
					key= {${index}}
					disabled={${step.disabled}}
					label="${step.labelText}">
						${step.items && step.items.length > 0
							? `<section>
								${step.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
							</section>`
						: ''}
					</Tab>`
				).join('\n')}
			</Tabs>`;
			}
		}
	}
};

