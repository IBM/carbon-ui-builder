import React, { useRef } from 'react';
import { TextInput, Tab, TabContent } from 'carbon-components-react';
import { AComponent, ComponentInfo } from '../a-component';
import image from '../../assets/component-icons/link.svg';
import { APlaceholder } from '../a-placeholder';
import { updatedState } from '../../components';
import { useFragment } from '../../context';
import { getDropIndex } from '../../routes/edit/tools';

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
	outline,
	...rest
}: any) => {
	return (
		<AComponent
			componentObj={componentObj}
			selected={selected}
			{...rest}>
			<Tab
			tabIndex={rest.index}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
			onDrop={onDrop}
			onDragOver={onDragOver}
			label={componentObj.labelText}
			disabled={componentObj.disabled}>
				{children}
			</Tab>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATab,
	settingsUI: ATabSettingsUI,
	codeUI: ATabCodeUI,
	render: ({ componentObj, select, remove, selected, renderComponents, onDragOver, outline }) => {
		const [fragment, setFragment] = useFragment();
		const holderRef = useRef(null as any);
		return (<ATab
			componentObj={componentObj}
			select={select}
			remove={remove}
			selected={selected}>
			{
				<section ref={holderRef} onDrop={(event) => {
					event.stopPropagation();
					event.preventDefault();
					const dropIndex = getDropIndex(event, holderRef.current);
					const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));
					setFragment({
						...fragment,
						data: updatedState(
							fragment.data,
							dragObj,
							componentObj.id,
							dropIndex
						)
					});
				}} onDragOver={onDragOver}>
					{
						componentObj.items && componentObj.items.length > 0
						? componentObj.items.map((tab: any) => renderComponents(tab, outline))
						: <APlaceholder componentObj={componentObj} select={select} />
					}
				</section>
			}
	</ATab>)},
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

