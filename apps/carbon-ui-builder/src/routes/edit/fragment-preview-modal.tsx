import React, { useContext, useEffect, useState } from 'react';

import {
	Button,
	Modal
} from '@carbon/react';
import {
	ArrowLeft,
	ArrowRight
} from '@carbon/react/icons';
import { css } from 'emotion';
import { ModalContext } from '../../context/modal-context';
import { UIFragment } from '@carbon-builder/ui-fragment';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../context';
import { getFragmentDuplicate } from '../../utils/fragment-tools';

const exportCodeModalStyle = css`
	.cds--tab-content {
		height: calc(100% - 40px);
		overflow: hidden;
	}
`;

const fragmentContainerStyle = css`
	background-color: white;
	border: 1px solid gray;
	height: calc(100vh - 257px);
`;

const controlsContainerStyle = css`
	position: relative;
	height: 48px;

	.next {
		position: absolute;
		right: 0;
	}
`;

export const FragmentPreviewModal = () => {
	const navigate = useNavigate();
	const { fragmentPreviewModal, hideFragmentPreviewModal } = useContext(ModalContext);
	const { addFragment, getExpandedFragmentState } = useContext(GlobalStateContext);

	const [fragmentState, setFragmentState] = useState(getExpandedFragmentState(JSON.parse(JSON.stringify(fragmentPreviewModal?.fragment || {}))));
	const [currentFragmentIndex, setCurrentFragmentIndex] = useState(fragmentPreviewModal?.fragments?.indexOf(fragmentPreviewModal?.fragment));

	useEffect(() => {
		setFragmentState(getExpandedFragmentState(fragmentPreviewModal?.fragment || {}));
		setCurrentFragmentIndex(fragmentPreviewModal?.fragments?.indexOf(fragmentPreviewModal?.fragment));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fragmentPreviewModal, fragmentPreviewModal?.fragment]);

	if (!fragmentPreviewModal.fragment || !fragmentPreviewModal.fragments) {
		return null;
	}

	const selectFragmentByIndex = (index: number) => {
		setCurrentFragmentIndex(index);
		setFragmentState(getExpandedFragmentState(JSON.parse(JSON.stringify(fragmentPreviewModal?.fragments[index]))));
	};

	const editOrCloneFragment = () => {
		if (!fragmentPreviewModal.isFeaturedFragment) {
			hideFragmentPreviewModal();
			navigate(`/edit/${(fragmentPreviewModal.fragments[currentFragmentIndex] || fragmentPreviewModal.fragment).id}`);
			return;
		}

		const fragmentCopy = getFragmentDuplicate(
			fragmentPreviewModal.fragments,
			fragmentPreviewModal.fragment,
			// When a new fragment is created from an existing template, it shouldn't
			// be a template by default.
			{ labels: fragmentPreviewModal?.fragment?.labels?.filter((label: string) => label !== 'template') }
		);

		addFragment(fragmentCopy);

		navigate(`/edit/${fragmentCopy.id}`);
		hideFragmentPreviewModal();
	};

	return (
		<Modal
		open={fragmentPreviewModal.isVisible}
		onRequestClose={hideFragmentPreviewModal}
		onRequestSubmit={editOrCloneFragment}
		primaryButtonText={ fragmentPreviewModal.isFeaturedFragment ? 'Make your own' : 'Edit' }
		size='lg'
		modalHeading={`Preview "${fragmentPreviewModal.fragments[currentFragmentIndex]?.title || fragmentPreviewModal.fragment.title}" code`}
		className={exportCodeModalStyle}>
			{
				fragmentPreviewModal.fragments && fragmentPreviewModal.fragments.length && <div className={controlsContainerStyle}>
					{
						!!currentFragmentIndex &&
						<Button
						kind='ghost'
						className='previous'
						onClick={() => selectFragmentByIndex(currentFragmentIndex - 1)}>
							<ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Previous
						</Button>
					}
					{
						currentFragmentIndex !== undefined && currentFragmentIndex < fragmentPreviewModal.fragments.length - 1 &&
						<Button
						kind='ghost'
						className='next'
						onClick={() => selectFragmentByIndex(currentFragmentIndex + 1)}>
							Next <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
						</Button>
					}
				</div>
			}
			<div className={fragmentContainerStyle}>
				<UIFragment
					state={fragmentState}
					setState={setFragmentState} />
			</div>
		</Modal>
	);
};
