import React, { useContext, useState } from 'react';
import { css, cx } from 'emotion';
import { Search } from 'carbon-components-react';

import { ElementTile } from '../../components/element-tile';

import { leftPane, leftPaneHeader } from '.';
import { allComponents } from '../../fragment-components';
import { GlobalStateContext } from '../../context';

const searchStyle = css`
	margin-top: 15px;
`;

const elementTileListStyle = css`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin-top: 100px;
`;

export const ElementsPane = ({isActive}: any) => {
	const [filterString, setFilterString] = useState('');
	const { fragments } = useContext(GlobalStateContext);

	const microLayouts = fragments.filter((fragment: any) => fragment.labels.includes('micro-layout'));

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
			<div className={leftPaneHeader}>
				Elements
				<Search
					id='elements-search'
					className={searchStyle}
					light
					labelText='Filter elements'
					placeholder='Filter elements'
					onChange={(event: any) => setFilterString(event.target.value)} />
			</div>
			<div className={elementTileListStyle}>
				{
					Object.values(allComponents)
					.filter((component: any) =>
						!component.componentInfo.hideFromElementsPane
						&& shouldShow(component.componentInfo.keywords))
					.map((component: any) =>
						<ElementTile componentObj={component.componentInfo.defaultComponentObj}>
							<img src={component.componentInfo.image} alt={component.componentInfo.name} />
							<span className='title'>{component.componentInfo.name}</span>
						</ElementTile>)
				}
			</div>
			{
				microLayouts && microLayouts.length > 0 && <>
					<h4>Micro layouts</h4>
					<div className={elementTileListStyle}>
						{
							Object.values(microLayouts)
							// TODO prevent recursive adding
							.filter((component: any) => shouldShow([component.title, ...component.labels]))
							.map((component: any) =>
								<ElementTile componentObj={{type: 'fragment', id: component.id}}>
									{/* <img src={component.componentInfo.image} alt={component.title} /> */}
									<span className='title'>{component.title}</span>
								</ElementTile>)
						}
					</div>
				</>
			}
		</div>
	);
};
