import React, { useContext, useRef } from 'react';
import { css } from 'emotion';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import {
	OverflowMenu,
	OverflowMenuItem,
	SkeletonText,
	Tile
} from 'carbon-components-react';
import { ModalContext, ModalActionType } from '../../context/modal-context';
import { FragmentPreview } from '../../components/fragment-preview';

const tileWrapper = css`
	position: relative;
	margin: 0.75rem;
	padding: 0;
	height: 250px;
	width: 350px;
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
	background-color: #ffffff;
	float: left;
`;

const tileStyle = css`
	padding: 0;
	background-color: #ffffff;
`;

const tileInnerWrapperBase = css`
	align-items: end;
`;

const tileInnerWrapper = css`
	${tileInnerWrapperBase}
	margin: 8px;
	h3 {
		font-size: 1rem;
		padding: 5px;
		padding-left: 16px;
	}
	.dashboard-link {
		color: black;
		text-decoration: none;
		transition: 0.3s;
	}
	.dashboard-link:hover {
		opacity: 0.6;
		color: #6f6f6f;
		cursor: pointer;
	}
	span {
		padding-left: 16px;
		font-style: italic;
		font-size: 0.75rem;
	}
`;
const fragmentOverflow = css`
	right: 5px;
	position: absolute;
	margin-top: 1rem;
	padding: 5px;
`;
const fragmentInfo = css`
	display: flex;
`;

export const FragmentTile = ({
	fragment,
	title,
	to,
	lastModified,
	setModalFragment
}: any) => {
	const history = useHistory();
	const [, dispatchModal] = useContext(ModalContext);
	const resetPreviewRef = useRef<any>(null);
	const handleModalState = (modalAction: ModalActionType) => {
		setModalFragment(fragment);
		dispatchModal({
			type: modalAction,
			id: fragment.id
		});
	};

	return (
		<div className={tileWrapper}>
			<Tile className={tileStyle} >
				<div className={tileInnerWrapper}>
					<Link to={to}>
						<FragmentPreview fragment={fragment} resetPreviewRef={resetPreviewRef} />
					</Link>
					<div className={fragmentInfo}>
						<div>
							<Link to={to} className='dashboard-link'>
								<h3>{title}</h3>
							</Link>
							<span>{lastModified ? lastModified : 'Last modified date unknown'}</span>
						</div>
						<OverflowMenu
							className={fragmentOverflow}
							ariaLabel='Fragment options'
							iconDescription=''
							onClick={
								(event: { stopPropagation: () => void; }) => { event.stopPropagation(); }
							}>
							<OverflowMenuItem
								itemText='Edit'
								onClick={() => { history.push(`/edit/${fragment.id}`); }}/>
							<OverflowMenuItem
								itemText='Export'
								onClick={() => { handleModalState(ModalActionType.setShareModal); }}/>
							<OverflowMenuItem
								itemText='Duplicate'
								onClick={() => { handleModalState(ModalActionType.setDuplicationModal); }}/>
							<OverflowMenuItem
								itemText='Reset preview'
								onClick={() => { resetPreviewRef.current() }}/>
							<OverflowMenuItem
								itemText='Remove'
								onClick={() => { handleModalState(ModalActionType.setDeletionModal); }}
								isDelete />
						</OverflowMenu>
					</div>
				</div>
			</Tile>
		</div>
	);
};

export const SkeletonFragmentTile = () => (
	<div className={tileWrapper}>
		<Tile>
			<div className={tileInnerWrapperBase}>
				<SkeletonText heading width='150px' />
			</div>
		</Tile>
	</div>
);
