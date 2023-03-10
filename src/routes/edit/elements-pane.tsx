import React, { useContext, useRef, useState } from 'react';
import { css, cx } from 'emotion';
import { Button, Search } from 'carbon-components-react';
import { ChevronUp16, ChevronDown16 } from '@carbon/icons-react';

import { ElementTile } from '../../sdk/src/element-tile';
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
	const paneRef = useRef(null as unknown as HTMLDivElement);
	const mouseYStart = useRef(0);
	const heightStart = useRef(0);
	const [fragment, setFragment] = useFragment();
	const { fragments, settings, setSettings } = useContext(GlobalStateContext);

	const isLayoutWidgetOpen = settings.layoutWidget?.isAccordionOpen === undefined
		? true // open by default
		: settings.layoutWidget?.isAccordionOpen;
	const setIsLayoutWidgetOpen = (is = true) => {
		setSettings({
			...settings,
			layoutWidget: {
				...(settings.layoutWidget || {}),
				isAccordionOpen: is
			}
		});
	};

	const layoutWidgetHeight = settings.layoutWidget?.height || 300;
	const setLayoutWidgetHeight = (height: number) => {
		setSettings({
			...settings,
			layoutWidget: {
				...(settings.layoutWidget || {}),
				height
			}
		});
	};

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

	const resize = (e: any) => {
		const newY = mouseYStart.current - e.pageY;

		const minHeight = 60;
		const maxHeight = paneRef.current?.clientHeight - 2.5 * minHeight;

		let newHeight = heightStart.current + newY;
		if (newHeight < minHeight) {
			newHeight = minHeight;
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight;
		}

		setLayoutWidgetHeight(newHeight);
	};

	const stopResize = () => {
		window.removeEventListener('mousemove', resize);
		window.removeEventListener('mouseup', stopResize);
	};

	return (
		<div className={cx(leftPane, isActive ? 'is-active' : '')} ref={paneRef}>
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
			<div className={css`position: relative;`}>
				<div
					className={css`
						position: absolute;
						top: 0;
						z-index: 1;
						height: 3px;
						width: 100%;
						&:hover {
							background-color: #0f62fe;
							cursor: ns-resize;
						}
					`}
					onMouseDown={(e) => {
						e.preventDefault();
						mouseYStart.current = e.pageY;
						heightStart.current = layoutWidgetHeight;
						window.addEventListener('mousemove', resize);
						window.addEventListener('mouseup', stopResize);
					}} />
				<Button
				kind='ghost'
				className={accordionButtonStyle}
				renderIcon={isLayoutWidgetOpen ? ChevronDown16 : ChevronUp16}
				onClick={() => setIsLayoutWidgetOpen(!isLayoutWidgetOpen)}>
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
