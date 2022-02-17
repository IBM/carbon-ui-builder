import React from 'react';
import {
    Checkbox,
	Dropdown,
    Tag,
	TextInput,
    Toggle
} from 'carbon-components-react';
import { css } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';

import image from './../assets/component-icons/button.svg';
import { angularClassNamesFromComponentObj, nameStringToVariableString, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ATagStyleUI = ({selectedComponent, setComponent}: any) => {
	const typeItems = [
        {id: 'gray', text: 'Gray'},
		{id: 'red', text: 'Red'},
		{id: 'magenta', text: 'Magenta'},
		{id: 'purple', text: 'Purple'},
		{id: 'blue', text: 'Blue'},
		{id: 'cyan', text: 'Cyan'},
		{id: 'teal', text: 'Teal'},
		{id: 'green', text: 'Green'},
        {id: 'cool-gray', text: 'Cool gray'},
        {id: 'warm-gray', text: 'Warm gray'},
        {id: 'high-contrast', text: 'High contrast'},
        {id: 'outline', text: 'Outline'},
	];

    const sizeItems = [
        {id: 'md', text: 'Medium'},
		{id: 'sm', text: 'Small'}
    ];

	return <>
		<TextInput
			value={selectedComponent.title}
			labelText='Title'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					title: event.currentTarget.value
				});
			}}
		/>

		<Dropdown
			label='Type'
			titleText='Type'
			items={typeItems}
			initialSelectedItem={typeItems.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				kind: event.selectedItem.id
		})}/>

        <Dropdown
			label='Size'
			titleText='Size'
			items={sizeItems}
			initialSelectedItem={typeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
		})}/>

        <Toggle
            labelText='Is filter'
            size='md'
            labelA='Filter'
            labelB='Chip'
            defaultToggled={selectedComponent.filter}
            onToggle={(isToggled: boolean) => setComponent({
                ...selectedComponent,
                filter: isToggled
				
            })} />

        <Checkbox
            labelText='Disabled'
            id='disabled'
            checked={selectedComponent.disabled}
            onChange={(checked: boolean) => {
                setComponent({
                    ...selectedComponent,
                    disabled: checked
                })
            }}/>

		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
};

export const ATag = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<Tag
			type={componentObj.kind}
			disabled={componentObj.disabled}
            filter={componentObj.filter}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{children}
			</Tag>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATag,
	styleUI: ATagStyleUI,
	render: ({ componentObj, select, remove, selected }) => <ATag
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.title}
	</ATag>,
	keywords: ['tag'],
	name: 'Tag',
	defaultComponentObj: {
		type: 'tag',
        // This field is `type` in the `Tag` component
		kind: 'gray',
        size: 'md',
        filter: false,
        disabled: false,
		title: 'Tag'
	},
	image,
	codeExport: {
		angular: {
			inputs: ({json}) => ``,
			outputs: ({json}) => `${json.filter ? `@Output() ${nameStringToVariableString(json.codeContext?.name)}Close = new EventEmitter();` : ''}`,
			imports: ['TagModule'],
			code: ({json}) => {
                const defaultProps = `
                    ${`type='${json.kind ? json.kind : "gray"}'`}
                    ${`size='${json.size ? json.size : "md"}'`}
                    [disabled]='${json.disabled}'
                `
                if (json.filter) {
                    return `<ibm-tag-filter
                        ${defaultProps}
                        (close)='${nameStringToVariableString(json.codeContext?.name)}Close.emit()'
                        ${angularClassNamesFromComponentObj(json)}>
                            ${json.title}
                    </ibm-tag-filter>
                    `;
                }

				return `<ibm-tag
                    ${defaultProps}
                    ${angularClassNamesFromComponentObj(json)}>
						${json.title}
				</ibm-tag>`;
			}
		},
		react: {
			imports: ['Tag'],
			code: ({ json }) => {
				return `<Tag
                    ${json.kind && ` type="${json.kind}"`}
                    ${`size='${json.size ? json.size : "md"}'`}
                    disabled={${json.disabled}}
                    filter={${json.filter}}
                    ${reactClassNamesFromComponentObj(json)}>
                        ${json.title}
                </Tag>`;
			}
		}
	}
};
