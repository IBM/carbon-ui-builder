import React, { useContext, useState } from 'react';

import { SelectableTile } from 'carbon-components-react';

import { FragmentPreview } from '../../../sdk/src/components/fragment-preview';
import './choose-fragment-modal.scss';
import { GlobalStateContext } from '../../../context';

export const ChooseFragmentModalTile = ({ fragment, selectedFragment, setSelectedFragment }: any) => {
	const [previewUrl, setPreviewUrl] = useState('');
	const { fragments, styleClasses } = useContext(GlobalStateContext);

	return (
		<div className='modal-tile-wrapper' key={fragment.id}>
			<SelectableTile
				className='tile-style'
				onClick={() => setSelectedFragment(fragment)}
				selected={fragment === selectedFragment}>
				<div className='tile-inner-wrapper'>
					<FragmentPreview
						fragment={fragment}
						fragments={fragments}
						styleClasses={styleClasses}
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
