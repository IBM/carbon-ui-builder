import React, { useContext, useState } from 'react';
import { css, cx } from 'emotion';
import { Button, Search } from 'carbon-components-react';
import { ChevronUp16, ChevronDown16 } from '@carbon/icons-react';

import { ElementTile } from '../../components/element-tile';
import { FragmentPreview } from '../../components/fragment-preview';

import { leftPane, leftPaneContent, leftPaneHeader } from '.';
import { allComponents } from '../../fragment-components';
import { GlobalStateContext, useFragment } from '../../context';
import { getEditScreenParams } from '../../utils/fragment-tools';
import { FragmentLayoutWidget } from '../../components/fragment-layout-widget';
import { accordionButtonStyle } from './settings-context-pane';

const elementTileListStyleBase = css`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	width: 270px;
`;

const elementTileListStyle = cx(elementTileListStyleBase, css`
	margin-top: 63px;
	margin-bottom: 2rem
`);

const elementTileListStyleMicroLayouts = cx(elementTileListStyleBase, css`
	margin-top: 1rem;

	img {
		max-height: 100px;
		max-width: 123px;
	}
`);

export const ElementsPane = ({ isActive }: any) => {
	const [filterString, setFilterString] = useState('');
	const [fragment, setFragment] = useFragment();
	const { fragments, settings, setSettings } = useContext(GlobalStateContext);

	const isLayoutWidgetOpen = settings.contextPane?.settings?.fragmentLayoutWidgetAccordionOpen;

	const updateContextPaneSettings = (s: any) => {
		setSettings({
			...settings,
			contextPane: {
				...(settings.contextPane || {}),
				settings: {
					...(settings.contextPane?.settings || {}),
					...s
				}
			}
		});
	};

	const layoutWidgetHeight = 300;

	const microLayouts = fragments.filter((fragment: any) => fragment.labels?.includes('micro-layout'));

	/**
	 * Returns true if element should show
	 *
	 * @param matches a list of strings that represent the component user might search for
	 */
	const shouldShow = (matches: string[]) => {
		return !filterString || matches.some((match) => match.includes(filterString.toLowerCase()));
	};

	const editScreenParams = getEditScreenParams();

	const visibleMicroLayouts = microLayouts?.filter((component: any) =>
		shouldShow([component.title, ...component.labels])
		&& component.id !== editScreenParams?.id);

	return (
		<div className={cx(leftPane, isActive ? 'is-active' : '')}>
			<div className={css`
			height: calc(100vh - 112px - 3rem ${isLayoutWidgetOpen ? `- ${layoutWidgetHeight}px` : ''});
			overflow-y: auto;`}>
				<div className={leftPaneHeader}>
					<Search
						id='elements-search'
						light
						labelText='Filter elements'
						placeholder='Filter elements'
						onChange={(event: any) => setFilterString(event.target.value)} />
				</div>
				<div className={leftPaneContent}>
					<div className={elementTileListStyle}>
						{
							Object.values(allComponents)
								.filter((component: any) =>
									!component.componentInfo.hideFromElementsPane
									&& shouldShow(component.componentInfo.keywords))
								.map((component: any) =>
									<ElementTile componentObj={component.componentInfo.defaultComponentObj} key={component.componentInfo.name}>
										<img src={component.componentInfo.image} alt={component.componentInfo.name} />
										<span className='title'>{component.componentInfo.name}</span>
									</ElementTile>)
						}
					</div>
					{
						visibleMicroLayouts && visibleMicroLayouts.length > 0 && <>
							<h4>Micro layouts</h4>
							<div className={elementTileListStyleMicroLayouts}>
								{
									visibleMicroLayouts.map((component: any) =>
										<ElementTile componentObj={{ type: 'fragment', fragmentId: component.id }} key={component.id}>
											<FragmentPreview fragment={component} />
											<span className='title'>{component.title}</span>
										</ElementTile>)
								}
							</div>
						</>
					}
				</div>
			</div>
			<div>
				<Button
				kind='ghost'
				className={accordionButtonStyle}
				renderIcon={isLayoutWidgetOpen ? ChevronDown16 : ChevronUp16}
				onClick={() => updateContextPaneSettings({
					fragmentLayoutWidgetAccordionOpen: !isLayoutWidgetOpen
				})}>
					Layout tree
				</Button>
				{
					isLayoutWidgetOpen
					&& <FragmentLayoutWidget
						className={css`
							overflow-y: auto;
							height: ${isLayoutWidgetOpen ? `${layoutWidgetHeight}px` : '2rem'};
						`}
						fragment={fragment}
						setFragment={setFragment} />
				}
			</div>
		</div>
	);
};
