import React, { useRef } from 'react';
import { TextInput, Tab } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import image from '../../assets/component-icons/link.svg';
import { updatedState } from '../../components';
import { useFragment } from '../../context';
import { getDropIndex } from '../../routes/edit/tools';
import { APlaceholder } from '../a-placeholder';

export const ATabSettingsUI = () => { return <></>};

export const ATabCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
			id='input-name'
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
};

export const ATab = ({
	componentObj,
	onDrop,
	onDragOver,
	children,
	selected,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();
	const holderRef = useRef(null as any);
	console.log('Children', children.length);
	return (
		<AComponent
		componentObj={componentObj}
		selected={selected}
		// handleDrop={(event: any) => {
		// 	debugger;
		// 	const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));
		// 	const dropIndex = getDropIndex(event, holderRef.current);
		// 	setFragment({
		// 		...fragment,
		// 		data: updatedState(
		// 			fragment.data,
		// 			dragObj,
		// 			componentObj.items[dropIndex].id,
		// 			dropIndex
		// 		)
		// 	});
		// }}
		{...rest}>
			<Tab
			onDrop={onDrop}
			label={componentObj.labelText}
			disabled={componentObj.disabled}>
					<span>2134</span>
					{
						children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
					}
			</Tab>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATab,
	settingsUI: ATabSettingsUI,
	codeUI: ATabCodeUI,
	render: ({ componentObj, select, remove, selected, renderComponents, onDragOver, onDrop, outline }) => <ATab
	componentObj={componentObj}
	disabled={componentObj.disabled}
	label={componentObj.labelText}
	select={select}
	remove={remove}
	onDragOver={onDragOver}
	onDrop={onDrop}
	selected={selected}>
		<section
			onDragOver={onDragOver}
			onDrop={onDrop}>
			<APlaceholder componentObj={componentObj} select={select} />
			{componentObj.items?.map((button: any) => renderComponents(button, outline))}
		</section>
	</ATab>,
	keywords: ['tab'],
	name: 'Tab',
	type: 'tab',
	defaultComponentObj: {
		type: 'tab',
		items: []
	},
	image,
	hideFromElementsPane: true,
	codeExport: {
		angular: {
			inputs: () => '',
			outputs: () => '',
			imports: [''],
			code: () => {
				return '';
			}
		},
		react: {
			imports: [''],
			code: () => {
				return '';
			}
		}
	}
};

