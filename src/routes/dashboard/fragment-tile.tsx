import React, { useContext, useState } from 'react';
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
import { getFragmentPreviewUrl } from '../../utils/fragment-tools';
import './fragment-tile.scss';

export const FragmentTile = ({
	fragment,
	title,
	to,
	lastModified,
	setModalFragment
}: any) => {
	const history = useHistory();
	const [, dispatchModal] = useContext(ModalContext);
	const [previewUrl, setPreviewUrl] = useState('');
	const handleModalState = (modalAction: ModalActionType) => {
		setModalFragment(fragment);
		dispatchModal({
			type: modalAction,
			id: fragment.id
		});
	};

	const resetPreview = async () => setPreviewUrl(await getFragmentPreviewUrl(fragment) as string);

	return (
		<div className='tile-wrapper'>
			<Tile className='tile-style' >
				<div className='tile-inner-wrapper'>
					<Link to={to}>
						<FragmentPreview
							fragment={fragment}
							previewUrl={previewUrl}
							setPreviewUrl={setPreviewUrl} />
					</Link>
					<div className='fragment-info'>
						<div>
							<Link to={to} className='dashboard-link'>
								<h3>{title}</h3>
							</Link>
							<span>{lastModified ? lastModified : 'Last modified date unknown'}</span>
						</div>
						<OverflowMenu
						className='fragment-overflow'
						ariaLabel='Fragment options'
						iconDescription=''
						onClick={(event: { stopPropagation: () => void }) => event.stopPropagation()}>
							<OverflowMenuItem
								itemText='Edit'
								onClick={() => history.push(`/edit/${fragment.id}`)} />
							<OverflowMenuItem
								itemText='Export'
								onClick={() => handleModalState(ModalActionType.setShareModal)} />
							<OverflowMenuItem
								itemText='Duplicate'
								onClick={() => handleModalState(ModalActionType.setDuplicationModal)} />
							<OverflowMenuItem
								itemText='Reset preview'
								onClick={resetPreview} />
							<OverflowMenuItem
								itemText='Remove'
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
