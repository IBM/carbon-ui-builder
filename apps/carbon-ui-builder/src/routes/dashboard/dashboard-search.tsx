import React from 'react';

import {
	Button,
	OverflowMenu,
	OverflowMenuItem,
	Search
} from '@carbon/react';

import {
	DocumentAdd,
	ArrowsVertical,
	CheckmarkFilled
} from '@carbon/react/icons';

import { css } from 'emotion';

const dashboardSearchWrapper = css`
	display: flex;
	width: 100%;

	// 520px is the point which the search bar becomes too small to display the full text, moves
	// the sort, share, and add button below the search bar at this point.
	@media screen and (max-width: 520px) {
		flex-wrap: wrap;
	}
`;

const searchInput = css`
	input {
		border-bottom: none;

		@media screen and (max-width: 520px) {
			margin-bottom: 15px;
		}
	}
`;

const sortButton = css`
	height: 3rem;
	width: 3rem;
	background-color: #f4f4f4;
`;

const sortOverflowItem = css`
	svg {
		transform: translate(7px, 1.5px);
	}
`;

export enum SortDirection {
	Ascending,
	Descending
}

export const DashboardSearch = ({
	onSearchHandler,
	onSortHandler,
	displayWizard,
	setDisplayWizard,
	sortDirection
}: any) => (
	<div className={dashboardSearchWrapper}>
		<Search
			labelText='Fragment'
			placeholder='Search fragments'
			className={searchInput}
			onChange={(event: any) => onSearchHandler(event.target.value)} />
		<OverflowMenu
			className={sortButton}
			ariaLabel='Sort fragment'
			renderIcon={() => <ArrowsVertical size={16} />}
			onClick={(event: { stopPropagation: () => void }) => event.stopPropagation()}>
			<OverflowMenuItem
				itemText={(
					<div className={sortOverflowItem}>
						Newest to oldest
						{
							sortDirection === SortDirection.Ascending
								? <CheckmarkFilled size={16} />
								: null
						}
					</div>
				)}
				onClick={() => onSortHandler(SortDirection.Ascending)} />
			<OverflowMenuItem
				itemText={(
					<div className={sortOverflowItem}>
						Oldest to newest
						{
							sortDirection === SortDirection.Descending
								? <CheckmarkFilled size={16} />
								: null
						}
					</div>
				)}
				onClick={() => onSortHandler(SortDirection.Descending)} />
		</OverflowMenu>
		<Button
		onClick={() => setDisplayWizard(!displayWizard)}
		title='Add new fragment'
		aria-label='Add new fragment'>
			New fragment
			<DocumentAdd size={16} className='cds--btn__icon' />
		</Button>
	</div>
);
