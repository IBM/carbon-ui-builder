import React, { useContext, useState } from 'react';

import {
	Button,
	Modal
} from 'carbon-components-react';
import {
	ArrowLeft16,
	ArrowRight16
} from '@carbon/icons-react';
import { css } from 'emotion';
import { ModalActionType, ModalContext } from '../../context/modal-context';
import { UIFragment } from '../../ui-fragment/src/ui-fragment';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../context';
import { getFragmentDuplicate } from '../../utils/fragment-tools';

const exportCodeModalStyle = css`
	.bx--tab-content {
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

export const PreviewFragmentModal = ({ fragment, fragments }: any) => {
	const navigate = useNavigate();
	const [modalState, dispatchModal] = useContext(ModalContext);
	const { addFragment } = useContext(GlobalStateContext);
	const [fragmentState, setFragmentState] = useState(JSON.parse(JSON.stringify(fragment.data)));
	const [currentFragmentIndex, setCurrentFragmentIndex] = useState(fragments.indexOf(fragment));

	const selectFragmentByIndex = (index: number) => {
		setCurrentFragmentIndex(index);
		setFragmentState(JSON.parse(JSON.stringify(fragments[index]?.data)));
	};

	const editOrCloneFragment = () => {
		if (!modalState.isFeaturedFragment) {
			dispatchModal({ type: ModalActionType.closeModal });
			navigate(`/edit/${(fragments[currentFragmentIndex] || fragment).id}`);
			return;
		}

		const fragmentCopy = getFragmentDuplicate(
			fragments,
			fragment,
			// When a new fragment is created from an existing template, it shouldn't
			// be a template by default.
			{ labels: fragment?.labels?.filter((label: string) => label !== 'template') }
		);

		addFragment(fragmentCopy);

		navigate(`/edit/${fragmentCopy.id}`);
		dispatchModal({ type: ModalActionType.closeModal });
	};

	return (
		<Modal
		open={modalState.ShowModal}
		onRequestClose={() => dispatchModal({ type: ModalActionType.closeModal })}
		onRequestSubmit={() => editOrCloneFragment()}
		primaryButtonText={ modalState.isFeaturedFragment ? 'Make your own' : 'Edit' }
		size='lg'
		modalHeading={`Preview "${fragments[currentFragmentIndex]?.title || fragment.title}" code`}
		className={exportCodeModalStyle}>
			{
				fragments && fragments.length && <div className={controlsContainerStyle}>
					{
						!!currentFragmentIndex &&
						<Button
						kind='ghost'
						className='previous'
						onClick={() => selectFragmentByIndex(currentFragmentIndex - 1)}>
							<ArrowLeft16 style={{ marginRight: '0.5rem' }} /> Previous
						</Button>
					}
					{
						currentFragmentIndex !== undefined && currentFragmentIndex < fragments.length - 1 &&
						<Button
						kind='ghost'
						className='next'
						onClick={() => selectFragmentByIndex(currentFragmentIndex + 1)}>
							Next <ArrowRight16 style={{ marginLeft: '0.5rem' }} />
						</Button>
					}
				</div>
			}
			<div className={fragmentContainerStyle}>
				<UIFragment state={fragmentState} setState={setFragmentState} />
			</div>
		</Modal>
	);
};
