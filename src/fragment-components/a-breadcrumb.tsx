import React from 'react';
import { Breadcrumb,
	TextInput,
	BreadcrumbItem,
	Checkbox } from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/breadcrumb.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';
import { DraggableTileList } from '../components';
import { css, cx } from 'emotion';

const preventCheckEvent = css`
	pointer-events: none;
`;
export const ABreadcumbSettingsUI = ({ selectedComponent, setComponent }: any) => {
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
				labelText='Breadcrumb label'
				onChange={(event: any) => {
					handleStepUpdate('itemText', event.currentTarget.value, index);
				}}
			/>
			<TextInput
				light
				value={item.href}
				labelText='Link'
				onChange={(event: any) => {
					handleStepUpdate('href', event.currentTarget.value, index);
				}}
			/>
		</>;
	};
	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};
	return <>
	<Checkbox
		labelText='No trailing slash'
		id='no-trailing-slash'
		checked={selectedComponent.noTrailingSlash}
		onChange={(checked: boolean) => {
			setComponent({
				...selectedComponent,
				noTrailingSlash: checked
			});
		}}
	/>
	<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={handleStepUpdate}
			defaultObject={{
				itemText: 'New Option',
				href: '/'
			}}
			template={template} />
	</>;

};

export const ABreadcrumbCodeUI = ({ selectedComponent, setComponent }: any) => {
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
	</>;
};

export const ABreadcrumb = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Breadcrumb
				noTrailingSlash={componentObj.noTrailingSlash}
				className={cx(preventCheckEvent, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}>
				{
					componentObj.items.map((step: any, index: number) => (
						<BreadcrumbItem
							href={step.href}
							key={index}>
								{step.itemText}
						</BreadcrumbItem>))
				}
			</Breadcrumb>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ABreadcrumb,
	settingsUI: ABreadcumbSettingsUI,
	codeUI: ABreadcrumbCodeUI,
	keywords: ['link'],
	name: 'Breadcrumb',
	type: 'breadcrumb',
	defaultComponentObj: {
		type: 'breadcrumb',
		noTrailingSlash: false,
		items: [
			{
				itemText: 'Breadcrumb 1',
				href: '/'
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `
			@Input() ${nameStringToVariableString(json.codeContext?.name)}noTrailingSlash = ${json.noTrailingSlash};`,
			outputs: (_) => ``,
			imports: ['BreadcrumbModule'],
			code: ({ json }) => {
				return `<ibm-breadcrumb
					[noTrailingSlash]="${nameStringToVariableString(json.codeContext?.name)}noTrailingSlash"
					${angularClassNamesFromComponentObj(json)}>
					${json.items.map((step: any) => (
						`<ibm-breadcrumb-item
							href="${step.href}">
								${step.itemText}
						</ibm-breadcrumb-item>`
					)).join('\n')}
				</ibm-breadcrumb>`;
			}
		},
		react: {
			imports: ['Breadcrumb', 'BreadcrumbItem'],
			code: ({ json }) => {
				return `<Breadcrumb
					noTrailingSlash={${json.noTrailingSlash }}
					${reactClassNamesFromComponentObj(json)}>
					${json.items.map((step: any) => (
						`<BreadcrumbItem
							href="${step.href}">
								${step.itemText}
						</BreadcrumbItem>`
						)).join('\n')}
					</Breadcrumb>`;
				}
		}
	}
};
