import React, {
	useState,
	useContext,
	useEffect
} from 'react';
import { css } from 'emotion';
import { Octokit } from 'octokit';
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

const octokit = new Octokit();

const githubContentRequest = {
	mediaType: {
		format: 'raw'
	},
	owner: 'IBM',
	repo: 'carbon-ui-builder-featured-fragments',
	path: 'featured-fragments'
};

export const Dashboard = ({
	displayWizard,
	setDisplayWizard,
	setModalFragment,
	setDisplayedModal
}: any) => {
	const { fragments, updateFragments } = useContext(GlobalStateContext);
	const [fragmentGroupDisplayed, setFragmentGroupDisplayed] = useState(FragmentGroupDisplayed.AllFragments);
	const [fragmentTitleFilter, setFragmentTitleFilter] = useState('');
	const [displayedFragments, setDisplayedFragments] = useState([]);
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

	const getFeaturedFragments = async () => {
		const featuredFragmentsResponse = await octokit.rest.repos.getContent(githubContentRequest);

		const allFeaturedFragments = await Promise.all((featuredFragmentsResponse.data as any[]).map(async (item) => {
			const fragmentFileResponse = await octokit.rest.repos.getContent({ ...githubContentRequest, path: item.path });
			try {
				return {
					id: item.path,
					title: item.name.substring(0, item.name.length - 5),
					lastModified: new Date(fragmentFileResponse.headers['last-modified'] || '').toISOString(),
					data: JSON.parse(fragmentFileResponse.data.toString())
				};
			} catch (error) {
				return null;
			}
		}));

		return allFeaturedFragments.filter(fragment => fragment !== null);
	};

	useEffect(() => {
		switch (fragmentGroupDisplayed) {
			case FragmentGroupDisplayed.Templates: {
				setDisplayedFragments(filterFragments(getFragmentTemplates(fragments)));
				break;
			}
			case FragmentGroupDisplayed.FeaturedFragments: {
				getFeaturedFragments().then((value: any) => {
					setDisplayedFragments(value);
				});
				break;
			}
			case FragmentGroupDisplayed.AllFragments:
			default:
				setDisplayedFragments(filterFragments(fragments));
				break;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fragmentGroupDisplayed, fragments]);

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
							isFeaturedFragment={fragmentGroupDisplayed === FragmentGroupDisplayed.FeaturedFragments}
							setModalFragment={setModalFragment}
							setDisplayedModal={setDisplayedModal}
							displayWizard={displayWizard}
							setDisplayWizard={setDisplayWizard} />
					}
				</Col>
			</Row>
		</Main>
	);
};
