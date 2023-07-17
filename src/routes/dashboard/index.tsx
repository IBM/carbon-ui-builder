import React, {
	useState,
	useContext,
	useEffect
} from 'react';
import { Loading } from 'carbon-components-react';
import { css, cx } from 'emotion';
import { DashboardSearch, SortDirection } from './dashboard-search';
import { FragmentGroupDisplayed, DashboardHeader } from './dashboard-header';

import {
	Col,
	Main,
	Row
} from './../../components';
import { FragmentTileList } from './fragment-tile-list';
import { GithubContext, GlobalStateContext } from '../../context';
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

export const Dashboard = ({
	displayWizard,
	setDisplayWizard,
	setModalFragment,
	setDisplayedModal
}: any) => {
	const { fragments, updateFragments } = useContext(GlobalStateContext);
	const { getFeaturedFragments, getBuiltInTemplates } = useContext(GithubContext);
	const [fragmentGroupDisplayed, setFragmentGroupDisplayed] = useState(FragmentGroupDisplayed.AllFragments);
	const [fragmentTitleFilter, setFragmentTitleFilter] = useState('');
	const [displayedFragments, setDisplayedFragments] = useState([]);
	const [featuredFragments, setFeaturedFragments] = useState([]);
	const [builtInTemplateFragments, setBuiltInTemplateFragments] = useState([]);
	const [sortDirection, setSortDirection] = useState(SortDirection.Ascending);
	const [isLoading, setIsLoading] = useState(false);

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

	useEffect(() => {
		switch (fragmentGroupDisplayed) {
			case FragmentGroupDisplayed.Templates: {
				if (builtInTemplateFragments.length <= 0) {
					setIsLoading(true);
				}
				setDisplayedFragments(filterFragments([...builtInTemplateFragments, getFragmentTemplates(fragments)]));
				getBuiltInTemplates().then((value: any) => {
					setBuiltInTemplateFragments(value);
					setDisplayedFragments(filterFragments([...value, getFragmentTemplates(fragments)]));
					setIsLoading(false);
				});
				break;
			}
			case FragmentGroupDisplayed.FeaturedFragments: {
				if (featuredFragments.length <= 0) {
					setIsLoading(true);
				}
				setDisplayedFragments(filterFragments(featuredFragments));
				getFeaturedFragments().then((value: any) => {
					setFeaturedFragments(value);
					setDisplayedFragments(filterFragments(value));
					setIsLoading(false);
				});
				break;
			}
			case FragmentGroupDisplayed.AllFragments:
			default:
				setDisplayedFragments(filterFragments(fragments));
				break;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fragmentGroupDisplayed, fragments, fragmentTitleFilter]);

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
						isLoading
						? <div className={css`height: 100%;`}>
							<Loading className={cx('center', css`left: calc(50% - 44px)`)} withOverlay={false} />
						</div>
						: <FragmentTileList
							fragments={displayedFragments}
							isFeaturedFragment={
								fragmentGroupDisplayed === FragmentGroupDisplayed.FeaturedFragments
								|| fragmentGroupDisplayed === FragmentGroupDisplayed.Templates
							}
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
