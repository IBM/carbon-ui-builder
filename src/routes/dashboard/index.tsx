import React, {
	useState,
	useContext,
	useEffect
} from 'react';
import { css } from 'emotion';
import { DashboardSearch, SortDirection } from './dashboard-search';
import { FragmentGroupDisplayed, DashboardHeader } from './dashboard-header';

import {
	Col,
	Main,
	Row
} from './../../components';
import { FragmentTileList } from './fragment-tile-list';
import { GlobalStateContext } from '../../context';
import { getFragmentTemplates } from '../../utils/fragment-tools';

const fragmentSort = (sortDirection: SortDirection) => function(a: any, b: any) {
	if (sortDirection === SortDirection.Descending) {
		return Date.parse(a.lastModified) - Date.parse(b.lastModified);
	}
	return Date.parse(b.lastModified) - Date.parse(a.lastModified);
};

// styles for the header (title and content switcher)
// to override carbon styling for <main>
const headerRowSyles = css`
	background: white;
	padding: 0 2rem;
	margin: 0 -2rem;
	padding-top: 2rem;
	margin-top: -2rem;
	.bx--col {
		padding: 0;
	}
`;

// additional styles for the search row
const searchRowStyles = css`
	padding-right: 0;
	padding-left: 1rem;
	margin: 0 -2rem;
	border-bottom: 1px solid #d6d6d6;
	.bx--col {
		padding-right: 0;
	}
`;

export const Dashboard = ({ displayWizard, setDisplayWizard, setModalFragment }: any) => {
	const { fragments, updateFragments } = useContext(GlobalStateContext);
	const [fragmentGroupDisplayed, setFragmentGroupDisplayed] = useState(FragmentGroupDisplayed.LocalOnly);
	const [fragmentTitleFilter, setFragmentTitleFilter] = useState('');
	const [sortDirection, setSortDirection] = useState(SortDirection.Ascending);

	useEffect(() => {
		updateFragments(fragments);
	// we don't want to run this effect when fragments change because it creates a loop
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		document.title = 'Carbon UI Builder • UI Fragments Composer';
	}, []);

	const filterFragments = (fragments: any) => fragments.filter((fragment: any) => fragment?.title?.toLowerCase()
		?.includes(fragmentTitleFilter.toLowerCase()) && !fragment.hidden)
		?.sort(fragmentSort(sortDirection));

	let displayedFragments;

	switch (fragmentGroupDisplayed) {
		case FragmentGroupDisplayed.Templates: {
			displayedFragments = filterFragments(getFragmentTemplates(fragments));
			break;
		}
		case FragmentGroupDisplayed.AllFragments:
		default:
			displayedFragments = filterFragments(fragments);
			break;
	}

	return (
		<Main style={{ marginLeft: '0px' }}>
			<Row styles={headerRowSyles}>
				<Col cols={{
					sm: 12,
					md: 12,
					lg: 12
				}}>
					<DashboardHeader
						onDisplayedSwitchHandler={setFragmentGroupDisplayed}
						fragmentGroupDisplayed={fragmentGroupDisplayed} />
				</Col>
			</Row>
			<Row styles={searchRowStyles}>
				<Col cols={{
					sm: 12,
					md: 12,
					lg: 12
				}}>
					<DashboardSearch
						onSearchHandler={setFragmentTitleFilter}
						onSortHandler={setSortDirection}
						sortDirection={sortDirection}
						displayWizard={displayWizard}
						setDisplayWizard={setDisplayWizard} />
				</Col>
			</Row>
			<Row>
				<Col cols={{
					sm: 12,
					md: 12,
					lg: 12
				}}>
					{
						<FragmentTileList
							fragments={displayedFragments}
							setModalFragment={setModalFragment} />
					}
				</Col>
			</Row>
		</Main>
	);
};
