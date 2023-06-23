import React, { useContext } from 'react';
import {
	ClickableTile,
	Column,
	Grid,
	Row
} from 'carbon-components-react';
import {
	Grid32,
	ArrowRight16,
	Code32,
	Development32
} from '@carbon/icons-react';
import { css } from 'emotion';
import { componentInfo as gridComponentInfo } from '../../sdk/src/fragment-components/a-grid';

import { FragmentTile } from './fragment-tile';

import { generateNewFragment } from './fragment-wizard/generate-new-fragment';
import { GlobalStateContext } from '../../context';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { initializeIds } from '../../sdk/src/tools';
import { FragmentWizardModals } from './fragment-wizard/fragment-wizard';

const tileStyle = css`
	width: 200px;
	height: 200px;
	position: relative;

	> svg {
		margin-bottom: 0.5rem;
	}
`;

const actionStyle = css`
    line-height: 2rem;
    display: flex;
    align-items: center;
    position: absolute;
	bottom: 0;

	svg {
		margin-left: 1rem;
	}
`;

const placeholderContainer = css`
	margin-top: 48px;
	display: flex;
	flex-direction: column;
	padding: 24px;
	align-items: center;
`;

const fragmentRowWrapper = css`
	margin-top: 3rem;
	background: #f4f4f4;
	min-width: 100%;
	height: 100%
`;

export const FragmentTileList = ({
	fragments,
	isFeaturedFragment,
	setModalFragment,
	setDisplayedModal,
	setDisplayWizard
}: any) => {
	const { addFragment, styleClasses, setStyleClasses } = useContext(GlobalStateContext);
	const navigate: NavigateFunction = useNavigate();

	const generateFragment = (items: any[] = []) => {
		const generatedFragment = generateNewFragment(
			{ items, id: 1 },
			styleClasses,
			setStyleClasses
		);

		addFragment(generatedFragment);

		navigate(`/edit/${generatedFragment.id}`);
	};

	const getTilesOrPlaceholder = () => {
		if ((!fragments || fragments.length === 0)) {
			return (
				<div className={placeholderContainer}>
					<div style={{ textAlign: 'left' }}>
						<Grid>
							<Row>
								<Column>
									<h3>Carbon UI Builder</h3>
									<p style={{ marginTop: '0.5em' }}>
										Build product pages in a fraction of time that it normally takes you.
									</p>
								</Column>
							</Row>
							<Row className={css`margin-top: 3rem;`}>
								<Column>
									<ClickableTile
									className={tileStyle}
									light={true}
									onClick={() => generateFragment([initializeIds(gridComponentInfo.defaultComponentObj)])}>
										<Grid32 />
										<p>Empty page (with grid)</p>
										<div className={actionStyle}>Start building <ArrowRight16 /></div>
									</ClickableTile>
								</Column>
								<Column>
									<ClickableTile
									className={tileStyle}
									light={true}
									onClick={() => generateFragment()}>
										<Development32 />
										<p>Empty fragment</p>
										<div className={actionStyle}>Start building <ArrowRight16 /></div>
									</ClickableTile>
								</Column>
								<Column>
									<ClickableTile
									className={tileStyle}
									light={true}
									onClick={() => {
										setDisplayWizard(true);
										setDisplayedModal(FragmentWizardModals.IMPORT_JSON_MODAL);
									}}>
										<Code32 />
										<p>Import JSON</p>
										<div className={actionStyle}>Continue building <ArrowRight16 /></div>
									</ClickableTile>
								</Column>
							</Row>
						</Grid>
					</div>
				</div>
			);
		}

		return fragments.map((v: any) => (
			<FragmentTile
				key={v.id}
				{...v}
				fragment={v}
				fragments={fragments}
				to={`/edit/${v.id}`}
				isFeaturedFragment={isFeaturedFragment}
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
