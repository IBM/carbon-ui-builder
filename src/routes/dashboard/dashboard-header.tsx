import React from 'react';
import { css } from 'emotion';
import { ContentSwitcher, Switch } from '@carbon/react';

// keep the enum order same as the switch order so context switcher
// knows to select the correct one. Shout if you have a cleaner alternative.
export enum FragmentGroupDisplayed {
	AllFragments,
	Templates,
	FeaturedFragments
}

const dashboardHeaderWrapper = css`
	display: flex;
	margin: 2rem 0;

	// 676px is when the content switcher becomes too small to show full text, moves the
	// content switcher below the title at this point.
	@media screen and (max-width: 676px) {
		flex-wrap: wrap;
	}
`;

const fragmentTitle = css`
	width: 100%;
`;

const contentSwitcher = css`
	width: 600px;
`;

export const DashboardHeader = ({ onDisplayedSwitchHandler, fragmentGroupDisplayed }: any) => (
	<div className={dashboardHeaderWrapper}>
		<h2 className={fragmentTitle}>Fragments</h2>
		<ContentSwitcher
			className={contentSwitcher}
			onChange={(event: any) => {
				onDisplayedSwitchHandler(event.name);
			}}
			selectedIndex={fragmentGroupDisplayed}>
			<Switch name={FragmentGroupDisplayed.AllFragments} text='All fragments' />
			<Switch name={FragmentGroupDisplayed.Templates} text='Templates only' />
			<Switch name={FragmentGroupDisplayed.FeaturedFragments} text='Featured' />
		</ContentSwitcher>
	</div>
);
