import React, { useRef, useState } from 'react';
import { css, cx } from 'emotion';
import {
	Button,
	Dropdown,
	NumberInput
} from 'carbon-components-react';

const marginDivStyle = css`
	display: flex;
	position: relative;
	height: 10rem;
	border: 1px solid #8d8d8d;
	background-color: #f4f4f4;
`;

const paddingDivStyle = css`
	display: flex;
	position: absolute;
	height: 6rem;
	left: 3rem;
	border: 1px solid #8d8d8d;
	width: calc(100% - 6rem);
	top: 30px;
	background-color: #f4f4f4;
`;

const unitsStyle = css`
	display: flex;
	gap: 3px;
	margin-top: 1rem;

	.bx--list-box__menu-item__option {
		padding-right: 1px;
	}
`;

const measurementButtonStyle = css`
	contain: layout;
	display: flex;
	position: absolute;
	margin: auto;
`;

const horizontalMeasurementButtonStyle = css`
	left: 50%;
	transform: translateX(-50%);
`;

const verticalMeasurementButtonStyle = css`
	top: 50%;
	transform: translateY(-50%);
`;

const centerElementStyle = css`
	border: 2px solid #d8d8d8;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 3.5rem;
	width: calc(100% - 7rem);
	height: 2rem;
	background-color: white;
`;

const sectionTitleStyle = css`
	padding: 3px;
`;

const buttonSelectedStyle = css`
	background: #393939;
	color: white;
`;

const cssUnitsItems = [
	{ text: 'px' },
	{ text: 'rem' },
	{ text: '%' },
	{ text: 'pt' }
];

const cssUnitsItemsToString = ((item: any) => (item ? item.text : ''));

type Dimension =
undefined
| 'marginTop'
| 'marginBottom'
| 'marginLeft'
| 'marginRight'
| 'paddingTop'
| 'paddingBottom'
| 'paddingLeft'
| 'paddingRight';

export const MarginPaddingWidget = ({ component, setComponent }: any) => {
	const [dimension, _setDimension] = useState(undefined as Dimension);
	const valueInputRef = useRef(null as any);

	const setDimension = (d: Dimension) => {
		valueInputRef.current.focus();
		_setDimension(d);
	};

	const dimensionUnits = component.style?.[dimension || '']?.units || 'px';
	const selectedUnitsItem = cssUnitsItems.find(item => dimensionUnits === item.text);

	const getButtonText = (dimension: string) => {
		return component.style?.[dimension]?.value !== undefined
			? `${component.style?.[dimension]?.value || 0}${component.style?.[dimension]?.units || 'px'}`
			: 'Set';
	};

	return <div>
		<div className={marginDivStyle}>
			<span className={sectionTitleStyle}>Margin</span>
			<Button
			kind='ghost'
			size='sm'
			className={cx(
				measurementButtonStyle,
				horizontalMeasurementButtonStyle,
				dimension === 'marginTop' ? buttonSelectedStyle : '',
				css`top: 0;`
			)}
			onClick={() => setDimension('marginTop')}>
				{ getButtonText('marginTop') }
			</Button>
			<Button
			kind='ghost'
			size='sm'
			className={cx(
				measurementButtonStyle,
				horizontalMeasurementButtonStyle,
				dimension === 'marginBottom' ? buttonSelectedStyle : '',
				css`bottom: 0;`
			)}
			onClick={() => setDimension('marginBottom')}>
				{ getButtonText('marginBottom') }
			</Button>
			<Button
			kind='ghost'
			size='sm'
			className={cx(
				measurementButtonStyle,
				verticalMeasurementButtonStyle,
				dimension === 'marginLeft' ? buttonSelectedStyle : '',
				css`left: 2px;`
			)}
			onClick={() => setDimension('marginLeft')}>
				{ getButtonText('marginLeft') }
			</Button>
			<Button
			kind='ghost'
			size='sm'
			className={cx(
				measurementButtonStyle,
				verticalMeasurementButtonStyle,
				dimension === 'marginRight' ? buttonSelectedStyle : '',
				css`right: 2px;`
			)}
			onClick={() => setDimension('marginRight')}>
				{ getButtonText('marginRight') }
			</Button>
			<div className={paddingDivStyle}>
				<span className={sectionTitleStyle}>Padding</span>
				<Button
				kind='ghost'
				size='sm'
				className={cx(
					measurementButtonStyle,
					horizontalMeasurementButtonStyle,
					dimension === 'paddingTop' ? buttonSelectedStyle : '',
					css`top: 0;`
				)}
				onClick={() => setDimension('paddingTop')}>
					{ getButtonText('paddingTop') }
				</Button>
				<Button
				kind='ghost'
				size='sm'
				className={cx(
					measurementButtonStyle,
					horizontalMeasurementButtonStyle,
					dimension === 'paddingBottom' ? buttonSelectedStyle : '',
					css`bottom: 0;`
				)}
				onClick={() => setDimension('paddingBottom')}>
					{ getButtonText('paddingBottom') }
				</Button>
				<Button
				kind='ghost'
				size='sm'
				className={cx(
					measurementButtonStyle,
					verticalMeasurementButtonStyle,
					dimension === 'paddingLeft' ? buttonSelectedStyle : '',
					css`left: 2px;`
				)}
				onClick={() => setDimension('paddingLeft')}>
					{ getButtonText('paddingLeft') }
				</Button>
				<Button
				kind='ghost'
				size='sm'
				className={cx(
					measurementButtonStyle,
					verticalMeasurementButtonStyle,
					dimension === 'paddingRight' ? buttonSelectedStyle : '',
					css`right: 2px;`
				)}
				onClick={() => setDimension('paddingRight')}>
					{ getButtonText('paddingRight') }
				</Button>
				<div className={centerElementStyle} />
			</div>
		</div>
		<div className={unitsStyle}>
			<NumberInput
				id='dimension-value'
				ref={valueInputRef}
				disabled={!dimension}
				size='sm'
				min={-100000}
				max={100000}
				step={1}
				hideLabel={true}
				value={dimension && component.style ? (component.style[dimension || '']?.value || 0) : 0}
				onChange={(event: any) => setComponent({
					...component,
					style: {
						...(component.style || {}),
						[dimension || '']: {
							...(component.style?.[dimension || ''] || {}),
							value: Number(event.imaginaryTarget.value)
						}
					}
				})} />
			<Dropdown
				id='css-units'
				label='CSS units'
				disabled={!dimension}
				size='sm'
				items={cssUnitsItems}
				itemToString={cssUnitsItemsToString}
				selectedItem={selectedUnitsItem}
				onChange={(event: any) => setComponent({
					...component,
					style: {
						...(component.style || {}),
						[dimension || '']: {
							...(component.style?.[dimension || ''] || {}),
							units: event.selectedItem.text
						}
					}
				})} />
		</div>
	</div>;
};
