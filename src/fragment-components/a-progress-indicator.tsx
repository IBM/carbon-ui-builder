import React from 'react';
import {
	Button,
	Checkbox,
	ProgressIndicator,
	ProgressStep,
	TextInput,
	Tile
} from 'carbon-components-react';
import {
	Add32,
	Draggable16,
	TrashCan32
} from '@carbon/icons-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';
import image from './../assets/component-icons/progress-indicator.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../utils/fragment-tools';

const onDragStyle = css`
	outline: 2px solid #1666fe;
	outline-offset; -2px;
`;

export const AProgressIndicatorStyleUI = ({ selectedComponent, setComponent }: any) => {
	const tiles = [...selectedComponent.progressSteps];

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
				...selectedComponent.progressSteps.slice(index + 1),
			]
		});
	}

	const addToStepsList = (event: any) => {
		event.stopPropagation();
		setComponent({
			...selectedComponent,
			progressSteps: [
				...selectedComponent.progressSteps,
				{
					id: new Date().getTime().toString(),
					label: `Step`,
					description: "Description",
					secondaryLabel: "Optional label",
					invalid: false,
					disabled: false,
				}
			]
		});
	}

	const removeFromStepsList = (event: any, id: number) => {
		event.stopPropagation();
		setComponent({
			...selectedComponent,
			progressSteps: selectedComponent.progressSteps.filter((step: any) => step.id !== id)
		});
	}

	const dragStart = (event: any) => {
		event.dataTransfer.setData('id', event.target.id);
	}

	const onDragOver = (event: any) => {
		event.preventDefault();
		event.currentTarget.classList.add(onDragStyle);
	}

	const onDragLeave = (event: any) => {
		event.currentTarget.classList.remove(onDragStyle);
	}

	const onDrop = (event: any, index: number) => {
		event.currentTarget.classList.remove(onDragStyle);
		const stepId = event.dataTransfer.getData('id');
		const previousIndex = selectedComponent.progressSteps.findIndex((step: any) => step.id === stepId);
		const tile = { ...selectedComponent.progressSteps[previousIndex] };
		tiles.splice(previousIndex, 1);

		setComponent({
			...selectedComponent,
			progressSteps: [
				...tiles.slice(0, index),
				tile,
				...tiles.slice(index)
			]
		});
	}

	return <>
		<Checkbox
			labelText='Is vertical'
			id='layout-select'
			checked={selectedComponent.isVertical}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					isVertical: checked
				})
			}}
		/>
		<div>
			{
				tiles.map((step: any, index: number) => (
					<Tile
						key={step.id}
						id={step.id}
						draggable={true}
						onDragStart={dragStart}
						onDragLeave={onDragLeave}
						onDragOver={onDragOver}
						onDrop={(event: any) => onDrop(event, index)}
						style={{ marginBottom: '1rem', position: 'relative' }}>
						<Draggable16 style={{ position: 'absolute', top: '50%', left: 0 }} />
						<div style={{ display: 'inline-flex', alignItems: 'flex-end', width: '100%' }}>
							<TextInput
								light
								size="sm"
								value={step.label}
								labelText="Label"
								onChange={(event: any) => handleStepUpdate('label', event.currentTarget.value, index)} />
							<Button
								style={{ marginLeft: 12 }}
								size="sm"
								kind="danger--tertiary"
								iconDescription="Delete step"
								hasIconOnly
								renderIcon={TrashCan32}
								onClick={(event: any) => removeFromStepsList(event, step.id)} />
						</div>
						<TextInput
							light
							value={step.secondaryLabel}
							labelText='Secondary label'
							onChange={(event: any) => handleStepUpdate('secondaryLabel', event.currentTarget.value, index)} />
						<div style={{ display: 'flex' }}>
							<Checkbox
								style={{ display: 'inline-flex' }}
								labelText='Is invalid'
								id={`invalid-select-${step.id}`}
								checked={step.invalid}
								onChange={(checked: any) => handleStepUpdate('invalid', checked, index)} />
							<Checkbox
								style={{ display: 'inline-flex' }}
								labelText='Is disabled'
								id={`disabled-select-${step.id}`}
								checked={step.disabled}
								onChange={(checked: any) => handleStepUpdate('disabled', checked, index)} />
						</div>
					</Tile>
				))
			}
			<Button
				renderIcon={Add32}
				kind="tertiary"
				size="sm"
				onClick={addToStepsList}>
					Add step
			</Button>
		</div>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>
}

export const AProgressIndicatorCodeUI = ({ selectedComponent, setComponent }: any) => {
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
	</>
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
					componentObj.progressSteps.map((step: any) => (
						<ProgressStep {...step} key={step.id} id={`step-${step.id}`} />
					))
				}
			</ProgressIndicator>
		</AComponent>
	);
}


export const componentInfo: ComponentInfo = {
	component: AProgressIndicator,
	styleUI: AProgressIndicatorStyleUI,
	codeUI: AProgressIndicatorCodeUI,
	keywords: ['progress', 'indicator'],
	name: 'Progress indicator',
	defaultComponentObj: {
		type: 'progressIndicator',
		isVertical: true,
		currentIndex: 0,
		spacing: true,
		progressSteps: [
			{
				id: new Date().getTime().toString(),
				label: "Step 0",
				description: "Step 0: Getting started with carbon design system",
				secondaryLabel: "Optional Label",
				invalid: false,
				disabled: false,
			}
		]
	},
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Steps = ${json.progressSteps};
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Vertical = ${json.isVertical || false}
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Spacing = ${json.spacing || false}
			@Input() ${nameStringToVariableString(json.codeContext?.name)}Current = ${json.currentIndex}`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}StepSelected = new EventEmitter<Event>();`,
			imports: ['ProgressIndicatorModule'],
			code: ({ json }) => {
				return `<ibm-progress-indicator
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
					currentIndex={state["${json.codeContext?.name}"] | 0}
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
						/>`)).join('\n')
					}
					</ProgressIndicator>`;
			}
		}
	}
};
