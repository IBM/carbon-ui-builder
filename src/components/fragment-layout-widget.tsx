import React, { useEffect, useState } from 'react';
import { Button } from 'carbon-components-react';
import {
	Edit16,
	TrashCan16,
	ChevronDown16,
	ChevronUp16
} from '@carbon/icons-react';
import { css } from 'emotion';
import { actionIconStyle } from '../routes';
import { stateWithoutComponent } from './fragment';

const widgetItemStyle = css`
	display: flex;
	line-height: 2rem;
	height: 2rem;

	&:not(:last-child) {
		border-bottom: 1px solid #e0e0e0;
	}

	button {
		height: 2rem;
	}
`;

const buttonStyle = css`
	width: 2rem;
	padding: 2px 7px;
	min-height: 2rem;
`;

export const FragmentLayoutWidget = ({ fragment, setFragment }: any) => {
	const [expansion, setExpansion] = useState({} as any);

	useEffect(() => {
		setExpansion({});
	}, [fragment.id]);

	const setExpanded = (component: any, expanded: boolean) => {
		setExpansion({
			...expansion,
			[component.id]: expanded
		});
	};

	const isExpanded = (component: any) => !!expansion[component.id];

	const LayoutWidgetItem = ({ componentObj, depth = 0 }: any) => {
		return <>
			<div className={widgetItemStyle}>
				<div className={css`width: ${depth}rem;`} />
				{
					componentObj.items && componentObj.items.length
					? <Button
						kind='ghost'
						aria-label='Toggle expanded'
						title='Toggle expanded'
						className={buttonStyle}
						onClick={() => setExpanded(componentObj, !isExpanded(componentObj))}>
								{
									isExpanded(componentObj)
									? <ChevronUp16 className={actionIconStyle} />
									: <ChevronDown16 className={actionIconStyle} />
								}
						</Button>
					: <div className={css`min-width: 32px;`} />
				}
				<span className={css`width: 100%;`}>{componentObj.type}</span>
				<Button
					kind='ghost'
					aria-label='Edit'
					title='Edit'
					className={buttonStyle}
					onClick={() => setFragment({
						...fragment,
						selectedComponentId: componentObj.id
					}, false)}>
					<Edit16 className={actionIconStyle} />
				</Button>
				<Button
					kind='ghost'
					aria-label='Delete'
					title='Delete'
					className={buttonStyle}
					onClick={() => setFragment({
						...fragment,
						// for whatever reason it's reporting this problem here for .data
						// eslint-disable-next-line react/prop-types
						data: stateWithoutComponent(fragment.data, componentObj.id)
					})}>
					<TrashCan16 className={actionIconStyle} />
				</Button>
			</div>
			{
				isExpanded(componentObj)
				&& componentObj.items?.map((component: any) =>
					<LayoutWidgetItem key={component.id} componentObj={component} depth={depth + 1} />
				)
			}
		</>;
	};

	return <div>
		{
			fragment.data.items?.map((component: any) => <LayoutWidgetItem key={component.id} componentObj={component} />)
		}
	</div>;
};
