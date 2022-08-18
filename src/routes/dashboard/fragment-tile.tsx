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
import { ModalContext, ModalActionType } from '../../context/modal-context';
import { FragmentPreview } from '../../components/fragment-preview';
import './fragment-tile.scss';

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
	setModalFragment,
	isFeaturedFragment
}: any) => {
	const navigate = useNavigate();
	const [, dispatchModal] = useContext(ModalContext);
	const resetPreview = useRef(null);

	const handleModalState = (modalAction: ModalActionType) => {
		setModalFragment(fragment);
		dispatchModal({
			type: modalAction,
			id: fragment.id
		});
	};

	const openPreview = (fragment: any, fragments: any[]) => {
		setModalFragment(fragment);
		dispatchModal({
			type: ModalActionType.setPreviewModal,
			fragment,
			fragments,
			isFeaturedFragment
		});
	};

	return (
		<div className='tile-wrapper'>
			<Tile className='tile-style' >
				<div className='tile-inner-wrapper'>
					{
						isFeaturedFragment
						? <section className={clickableStyle} onClick={() => openPreview(fragment, fragments)}>
							<FragmentPreview fragment={fragment} resetPreview={resetPreview} />
						</section>
						: <Link to={to}>
							<FragmentPreview fragment={fragment} resetPreview={resetPreview} />
						</Link>
					}

					<div className='fragment-info'>
						<div>
							{
								isFeaturedFragment
								? <section className={clickableStyle} onClick={() => openPreview(fragment, fragments)}>
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
								onClick={() => handleModalState(ModalActionType.setExportModal)} />
							<OverflowMenuItem
								itemText={<div className={menuItemStyle}><Copy16 /> Duplicate</div>}
								onClick={() => handleModalState(ModalActionType.setDuplicationModal)} />
							<OverflowMenuItem
								itemText={<div className={menuItemStyle}><View16 /> Open preview</div>}
								onClick={() => openPreview(fragment, fragments)} />
							<OverflowMenuItem
								itemText={<div className={menuItemStyle}><TrashCan16 /> Delete</div>}
								onClick={() => handleModalState(ModalActionType.setDeletionModal)}
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
