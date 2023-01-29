import React, { useState } from 'react';

import { SelectableTile } from '@carbon/react';

import { FragmentPreview } from '../../../components/fragment-preview';
import './choose-fragment-modal.scss';

export const ChooseFragmentModalTile = ({ fragment, selectedFragment, setSelectedFragment }: any) => {
	const [previewUrl, setPreviewUrl] = useState('');

	return (
		<div className='modal-tile-wrapper' key={fragment.id}>
			<SelectableTile
				className='tile-style'
				onClick={() => setSelectedFragment(fragment)}
				selected={fragment === selectedFragment}>
				<div className='tile-inner-wrapper'>
					<FragmentPreview
						fragment={fragment}
						previewUrl={previewUrl}
						setPreviewUrl={setPreviewUrl} />
					<h3>{fragment.title}</h3>
					<span>
						{fragment.lastModified || 'Last modified date unknown'}
					</span>
				</div>
			</SelectableTile>
		</div>
	);
};
