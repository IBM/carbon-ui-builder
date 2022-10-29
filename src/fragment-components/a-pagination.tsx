import React from 'react';
import {
	Pagination,
	TextInput,
	Checkbox,
	NumberInput,
	Dropdown
} from 'carbon-components-react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/pagination.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

export const APaginationSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	return <>
		<Checkbox
			labelText='pagesUnknown'
			id='pagesUnknown'
			checked={selectedComponent.pagesUnknown}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					pagesUnknown: checked
				});
			}} />

		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}} />

		<Checkbox
			labelText='isLastPage'
			id='isLastPage'
			checked={selectedComponent.isLastPage}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					isLastPage: checked
				});
			}} />

		<Checkbox
			labelText='Page size input disabled'
			id='pageSizeInputDisabled'
			checked={selectedComponent.pageSizeInputDisabled}
			onChange={(checked: boolean) => {
				setComponent({
					...selectedComponent,
					pageSizeInputDisabled: checked
				});
			}} />

		<Dropdown
			id='size-dropdown'
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />

		<TextInput
			value={selectedComponent.pageNumberText}
			labelText='Page number text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				pageNumberText: event.currentTarget.value
			})} />

		<NumberInput
			id="total-items"
			invalidText="Total number item is not valid"
			label="Total items"
			max={1000}
			min={0}
			step={10}
			value={selectedComponent.totalItems}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				totalItems: Number(event.imaginaryTarget.value)
			})} />

		<NumberInput
			id="page-size"
			invalidText="Page sizeis not valid"
			label="Page size"
			max={100}
			min={0}
			step={10}
			value={selectedComponent.pageSize}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				pageSize: Number(event.imaginaryTarget.value)
			})} />

		<NumberInput
			id="page"
			invalidText="Page number is not valid"
			label="Page"
			max={100}
			min={0}
			step={10}
			value={selectedComponent.page}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				page: Number(event.imaginaryTarget.value)
			})} />

		<TextInput
			value={selectedComponent.itemsPerPageText}
			labelText='Items per page text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				itemsPerPageText: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.forwardText}
			labelText='Forward text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				forwardText: event.currentTarget.value
			})} />

		<TextInput
			value={selectedComponent.backwardText}
			labelText='Backwards text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				backwardText: event.currentTarget.value
			})} />
	</>;
};

export const APaginationCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const APagination = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Pagination
			className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
			backwardText={componentObj.backwardText}
			forwardText={componentObj.forwardText}
			itemsPerPageText={componentObj.itemsPerPageText}
			page={componentObj.page}
			pageNumberText={componentObj.pageNumberText}
			pageSize={componentObj.pageSize}
			disabled={componentObj.disabled}
			isLastPage={componentObj.isLastPage}
			pagesUnknown={componentObj.pagesUnknown}
			pageSizeInputDisabled={componentObj.pageSizeInputDisabled}
			totalItems={componentObj.totalItems}
			size={componentObj.size}
			pageSizes={[
				10,
				20,
				30,
				40,
				50
			]} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: APagination,
	settingsUI: APaginationSettingsUI,
	codeUI: APaginationCodeUI,
	render: ({ componentObj, select, remove, selected }) => <APagination
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
	</APagination>,
	keywords: ['pagination'],
	name: 'Pagination',
	type: 'pagination',
	defaultComponentObj: {
		type: 'pagination',
		backwardText: 'Previous page',
		forwardText: 'forwardText',
		itemsPerPageText: 'Items per page:',
		pageNumberText: 'Page Number',
		disabled: false,
		isLastPage: false,
		pagesUnknown: false,
		page: 1,
		totalItems: 100,
		pageSize: 10,
		pageSizeInputDisabled: false,
		size: 'md'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => '',
			outputs: ({ json }) => '',
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		},
		react: {
			imports: [''],
			code: ({ json }) => {
				return ``;
			}
		}
	}
};
