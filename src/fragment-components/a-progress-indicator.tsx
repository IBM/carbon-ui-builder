import React from 'react';
import {
	Checkbox,
	ProgressIndicator,
	ProgressStep,
	TextInput
} from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentInfo } from '.';
import image from './../assets/component-icons/progress-indicator.svg';
import { DraggableTileList } from '../components';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

export const AProgressIndicatorSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const handleStepUpdate = (key: string, value: any, index: number) => {
		const step = {
			...selectedComponent.progressSteps[index],
			[key]: value
		};

		setComponent({
			...selectedComponent,
			progressSteps: [
				...selectedComponent.progressSteps.slice(0, index),
				step,
				...selectedComponent.progressSteps.slice(index + 1)
			]
		});
	};

	const template = (item: any, index: number) => {
		return <>
			<TextInput
				light
				value={item.label}
				labelText="Label"
				onChange={(event: any) => handleStepUpdate('label', event.currentTarget.value, index)} />
			<TextInput
				light
				value={item.secondaryLabel}
				labelText='Secondary label'
				onChange={(event: any) => handleStepUpdate('secondaryLabel', event.currentTarget.value, index)} />
			<div style={{ display: 'flex' }}>
				<Checkbox
					style={{ display: 'inline-flex' }}
					labelText='Is invalid'
					id={`invalid-select-${index}`}
					checked={item.invalid}
					onChange={(checked: any) => handleStepUpdate('invalid', checked, index)} />
				<Checkbox
					style={{ display: 'inline-flex' }}
					labelText='Is disabled'
					id={`disabled-select-${index}`}
					checked={item.disabled}
					onChange={(checked: any) => handleStepUpdate('disabled', checked, index)} />
			</div>
		</>;
	};

	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			progressSteps: newList
		});
	};

	return <>
		<Checkbox
			labelText='Is vertical'
			id='layout-select'
			checked={selectedComponent.isVertical}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					isVertical: checked
				});
			}}
		/>
		<DraggableTileList
			dataList={[...selectedComponent.progressSteps]}
			setDataList={updateStepList}
			updateItem={handleStepUpdate}
			defaultObject={{
				label: 'Step',
				description: 'Description',
				secondaryLabel: 'Optional label',
				invalid: false,
				disabled: false
			}}
			template={template} />
	</>;
};

export const AProgressIndicatorCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
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

export const AProgressIndicator = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
			<ProgressIndicator
			currentIndex={componentObj.currentIndex}
			vertical={componentObj.isVertical}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}>
				{
					componentObj.progressSteps.map((step: any, index: number) => (
						<ProgressStep {...step} key={index} />
					))
				}
			</ProgressIndicator>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AProgressIndicator,
	settingsUI: AProgressIndicatorSettingsUI,
	codeUI: AProgressIndicatorCodeUI,
	type: 'progress-indicator',
	keywords: ['progress', 'indicator', 'step', 'wizard'],
	name: 'Progress indicator',
	defaultComponentObj: {
		type: 'progress-indicator',
		isVertical: true,
		currentIndex: 0,
		spacing: true,
		progressSteps: [
			{
				label: 'Step 1',
				description: 'Step 1 description',
				secondaryLabel: 'Optional label',
				invalid: false,
				disabled: false
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => {
				const steps = json.progressSteps.map((step: any) => ({
					text: step.label,
					description: step.secondaryLabel,
					state: ['incomplete'],
					...(step.disabled ? { disabled: step.disabled } : {})
				}));
				return `@Input() ${nameStringToVariableString(json.codeContext?.name)}Steps = ${JSON.stringify(steps)};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Orientation = "${json.isVertical ? 'vertical' : 'horizontal'}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Spacing = ${json.spacing || false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Current = ${json.currentIndex};`;
			},
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}StepSelected = new EventEmitter<Event>();`,
			imports: ['ProgressIndicatorModule'],
			code: ({ json }) => {
				return `<ibm-progress-indicator
					[orientation]="${nameStringToVariableString(json.codeContext?.name)}Orientation"
					[steps]="${nameStringToVariableString(json.codeContext?.name)}Steps"
					[current]="${nameStringToVariableString(json.codeContext?.name)}Current"
					(stepSelected)="${nameStringToVariableString(json.codeContext?.name)}StepSelected.emit($event)"
					[spacing]="${nameStringToVariableString(json.codeContext?.name)}Spacing"
					${angularClassNamesFromComponentObj(json)}>
				</ibm-progress-indicator>`;
			}
		},
		react: {
			imports: ['ProgressIndicator', 'ProgressStep'],
			code: ({ json }) => {
				return `<ProgressIndicator
					currentIndex={state["${json.codeContext?.name}StepIndex"] || 0}
					${json.isVertical ? 'vertical={true}' : ''}
					${reactClassNamesFromComponentObj(json)}
					onChange={(selectedStep) => handleInputChange({
						target: {
							name: "${json.codeContext?.name}",
							value: selectedStep
						}
					})}>
					${json.progressSteps.map((step: any) => (`<ProgressStep
							label="${step.label}"
							${step.invalid ? 'invalid' : ''}
							${step.disabled ? 'disabled' : ''}
							${step.secondaryLabel !== undefined || step.secondaryLabel !== '' ? `secondaryLabel="${step.secondaryLabel}"` : ''}
							${step.description !== undefined || step.description !== '' ? `description="${step.description}"` : ''}
						/>`)).join('\n')}
					</ProgressIndicator>`;
			}
		}
	}
};
