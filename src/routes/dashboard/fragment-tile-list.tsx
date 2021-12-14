import React from 'react';
import { css } from 'emotion';

import { FragmentTile } from './fragment-tile';

// import the img placeholder svg
import placeholder from './../../assets/dashboard-empty-state.svg';

// styles for placeholder
const svgStyle = css`
	width: 25vw;
	height: auto;
	max-width: 400px;
`;

const placeholderContainer = css`
	margin-top: 48px;
	display: flex;
	flex-direction: column;
	height: calc(100vh - 48px);
	padding: 24px;
	padding-top: 150px;
	align-items: center;
`;

const fragmentRowWrapper = css`
	margin-top: 3rem;
	background: #f4f4f4;
	min-width: 100%;
	height: 100%
`;

export const FragmentTileList = ({ fragments, loaded, setModalFragment }: any) => {
	const getTilesOrPlaceholder = () => {
		if ((!fragments || fragments.length === 0) && loaded) {
			return (
				<div className={placeholderContainer}>
					<div style={{ textAlign: 'left' }}>
						<img alt="No fragments exist" src={placeholder} className={svgStyle} />
						<h3>You have no fragments here.</h3>
						<p style={{ marginTop: '0.5em' }}>
							To build a new fragment, click <strong>New Fragment</strong>.
						</p>
					</div>
				</div>
			);
		}

		return fragments.map((v: any) => (
			<FragmentTile
				key={v.id}
				{...v}
				fragment={v}
				to={`/edit/${v.id}`}
				{...v.lastModified}
				setModalFragment={setModalFragment}/>
		));
	};

	return (
		<div className={fragmentRowWrapper}>
			{getTilesOrPlaceholder()}
		</div>
	);
};
