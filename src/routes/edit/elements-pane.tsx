import React, { useState } from 'react';
import { css, cx } from 'emotion';
import { Search } from 'carbon-components-react';

import { ElementTile } from '../../components/element-tile';

import buttonImg from './../../assets/component-icons/button.svg';
import checkboxImg from './../../assets/component-icons/checkbox.svg';
import gridImg from './../../assets/component-icons/grid.svg';
import textAreaImg from './../../assets/component-icons/text-area.svg';
import textInputImg from './../../assets/component-icons/text-input.svg';
import textImg from './../../assets/component-icons/text.svg';

import { leftPane } from '.';

const searchStyle = css`
	margin-top: 15px;
	margin-bottom: 30px;
`;

const elementTileListStyle = css`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
`;

export const ElementsPane = ({isActive}: any) => {
	const [filterString, setFilterString] = useState('');

	/**
	 * Returns true if element should show
	 *
	 * @param matches a list of strings that represent the component user might search for
	 */
	const shouldShow = (matches: string[]) => {
		return !filterString || matches.some((match) => match.includes(filterString));
	};

	return (
		<div className={cx(leftPane, isActive ? 'is-active' : '')}>
			Elements
			<Search
				id='elements-search'
				className={searchStyle}
				light
				labelText='Filter elements'
				placeHolderText='Filter elements'
				onChange={(event: any) => setFilterString(event.target.value)} />
			<div className={elementTileListStyle}>
				{
					shouldShow(['button']) && <ElementTile componentObj={{
						type: 'button',
						kind: 'primary',
						text: 'Button'
					}}>
						<img src={buttonImg} alt='button'/>
						<span className='title'>Button</span>
					</ElementTile>
				}
				{
					shouldShow(['checkbox', 'check box']) && <ElementTile componentObj={{
						type: 'checkbox',
						label: 'Checkbox'
					}}>
						<img src={checkboxImg} alt='checkbox'/>
						<span className='title'>Checkbox</span>
					</ElementTile>
				}
				{
					shouldShow(['text']) && <ElementTile componentObj={{
						type: 'text',
						text: 'Text'
					}}>
						<img src={textImg} alt='text'/>
						<span className='title'>Text</span>
					</ElementTile>
				}
				{
					shouldShow(['textarea', 'text area']) && <ElementTile componentObj={{
						type: 'textarea',
						label: 'Text area label',
						placeholder: 'Text area placeholder',
						helperText: 'Helper text'
					}}>
						<img src={textAreaImg} alt='text area'/>
						<span className='title'>Text area</span>
					</ElementTile>
				}
				{
					shouldShow(['textinput', 'text input']) && <ElementTile componentObj={{
						type: 'textinput',
						label: 'Text input label',
						placeholder: 'Text input placeholder',
						helperText: 'Helper text',
						inputType: 'text'
					}}>
						<img src={textInputImg} alt='text input'/>
						<span className='title'>Text input</span>
					</ElementTile>
				}
				{
					shouldShow(['grid', 'row', 'column']) && <ElementTile componentObj={{
						type: 'grid',
						items: [
							{
								type: 'row', items: [
									{ type: 'column', items: [{ type: 'text', text: 'A' }]},
									{ type: 'column', items: [{ type: 'text', text: 'B' }]}
								]
							},
							{
								type: 'row', items: [
									{ type: 'column', items: [{ type: 'text', text: 'C' }]},
									{ type: 'column', items: [{ type: 'text', text: 'D' }]}
								]
							}
						]
					}}>
						<img src={gridImg} alt='grid'/>
						<span className="title">Grid</span>
					</ElementTile>
				}
			</div>
		</div>
	);
};
