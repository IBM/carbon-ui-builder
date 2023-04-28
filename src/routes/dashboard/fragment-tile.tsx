import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	OverflowMenu,
	OverflowMenuItem,
	SkeletonText,
	Tile
} from 'carbon-components-react';
import {
	Copy16,
	DocumentExport16,
	Edit16,
	View16,
	TrashCan16
} from '@carbon/icons-react';
import { css } from 'emotion';
import { ModalContext } from '../../context/modal-context';
import { FragmentPreview } from '../../sdk/src/components/fragment-preview';
import './fragment-tile.scss';
import { GlobalStateContext } from '../../context';

const menuItemStyle = css`
	display: flex;
	align-items: center;

	svg {
		margin-right: 0.5rem;
	}
`;

const clickableStyle = css`
	cursor: pointer;
`;

export const FragmentTile = ({
	fragment,
	fragments,
	title,
	to,
	lastModified,
	isFeaturedFragment
}: any) => {
	const navigate = useNavigate();
	const { styleClasses, fragments: allFragments } = useContext(GlobalStateContext);
	const {
		showFragmentDuplicateModal,
		showFragmentDeleteModal,
		showFragmentExportModal,
		showFragmentPreviewModal
	} = useContext(ModalContext);
	const resetPreview = useRef(null);

	return (
		<div className='tile-wrapper'>
			<Tile className='tile-style' >
				<div className='tile-inner-wrapper'>
					{
						isFeaturedFragment
						? <section
						className={clickableStyle}
						onClick={() => showFragmentPreviewModal(fragment, fragments, isFeaturedFragment)}>
							<FragmentPreview fragment={fragment} fragments={allFragments} styleClasses={styleClasses} resetPreview={resetPreview} />
						</section>
						: <Link to={to}>
							<FragmentPreview fragment={fragment} fragments={allFragments} styleClasses={styleClasses} resetPreview={resetPreview} />
						</Link>
					}

					<div className='fragment-info'>
						<div>
							{
								isFeaturedFragment
								? <section
								className={clickableStyle}
								onClick={() => showFragmentPreviewModal(fragment, fragments, isFeaturedFragment)}>
									<h3>{title}</h3>
								</section>
								: <Link to={to} className='dashboard-link'>
									<h3>{title}</h3>
								</Link>
							}
							<span>{lastModified ? lastModified : 'Last modified date unknown'}</span>
						</div>
						<OverflowMenu
						className='fragment-overflow'
						ariaLabel='Fragment options'
						iconDescription='fragment menu'
						onClick={(event: { stopPropagation: () => void }) => event.stopPropagation()}>
							{
								!isFeaturedFragment && <OverflowMenuItem
									itemText={<div className={menuItemStyle}><Edit16 /> Edit</div>}
									onClick={() => navigate(`/edit/${fragment.id}`)} />
							}
							<OverflowMenuItem
								itemText={<div className={menuItemStyle}><DocumentExport16 /> Export</div>}
								onClick={() => showFragmentExportModal(fragment)} />
							<OverflowMenuItem
								itemText={<div className={menuItemStyle}><Copy16 /> Duplicate</div>}
								onClick={() => showFragmentDuplicateModal(fragment)} />
							<OverflowMenuItem
								itemText={<div className={menuItemStyle}><View16 /> Open preview</div>}
								onClick={() => showFragmentPreviewModal(fragment, fragments, isFeaturedFragment)} />
							<OverflowMenuItem
								itemText={<div className={menuItemStyle}><TrashCan16 /> Delete</div>}
								onClick={() => showFragmentDeleteModal(fragment.id)}
								isDelete />
						</OverflowMenu>
					</div>
				</div>
			</Tile>
		</div>
	);
};

export const SkeletonFragmentTile = () => (
	<div className='tile-wrapper'>
		<Tile>
			<div className='tile-inner-wrapper-base'>
				<SkeletonText heading width='150px' />
			</div>
		</Tile>
	</div>
);
