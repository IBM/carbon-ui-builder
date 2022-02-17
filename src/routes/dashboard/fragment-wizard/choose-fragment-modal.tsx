import React, { useContext, useState } from 'react';

import {
	Modal,
	InlineNotification,
	NotificationActionButton,
	SelectableTile
} from 'carbon-components-react';
import { FragmentWizardModals } from './fragment-wizard';

import { GlobalStateContext } from '../../../context';
import { useHistory } from 'react-router-dom';
import { warningNotificationProps } from '../../../utils/file-tools';
import { Col } from '../../../components';
import { FragmentPreview } from '../../../components/fragment-preview';
import { duplicateFragment } from '../../../utils/fragment-tools';
import './choose-fragment-modal.scss';

export interface ChooseFragmentModalProps {
	shouldDisplay: boolean,
	setShouldDisplay: (shouldDisplay: boolean) => void,
	setDisplayedModal: (displayedModal: FragmentWizardModals | null) => void,
	setLastVisitedModal: (lastVisitedModal: FragmentWizardModals) => void,
	lastVisitedModal: FragmentWizardModals,
	uploadedData: any,
	setUploadedData: (uploadedData: any) => void
}

export const ChooseFragmentModal = (props: ChooseFragmentModalProps) => {
	const [selectedFragment, setSelectedFragment] = useState<any>(null);
	const { fragments, addFragment } = useContext(GlobalStateContext);
	const [previewUrl, setPreviewUrl] = useState('');

	const history = useHistory();

	const generateFragment = () => {
		if (selectedFragment === null) {
			return;
		}

		const fragmentCopy = duplicateFragment(
			fragments,
			selectedFragment,
			{ labels: selectedFragment?.labels?.filter((label: string) => label !== 'template') }
		);

		addFragment(fragmentCopy);
		history.push(`/edit/${fragmentCopy.id}`);
	};

	return (
		<Modal
			open={props.shouldDisplay}
			size='lg'
			shouldSubmitOnEnter={false}
			selectorPrimaryFocus='.bx--tile--selectable'
			onRequestSubmit={() => {
				generateFragment();
				props.setLastVisitedModal(FragmentWizardModals.CHOOSE_FRAGMENT_MODAL);
			}}
			onRequestClose={() => { props.setShouldDisplay(false); }}
			onSecondarySubmit={() => {
				props.setDisplayedModal(props.lastVisitedModal);
				props.setLastVisitedModal(FragmentWizardModals.CHOOSE_FRAGMENT_MODAL);
			}}
			hasForm
			modalHeading='Create new fragment'
			primaryButtonText='Done'
			primaryButtonDisabled={!selectedFragment}
			secondaryButtonText='Back'>
			{
				props.uploadedData.wasDataModified
					? <InlineNotification
						{ ...warningNotificationProps }
						actions={
							<>
								<NotificationActionButton
									onClick={() => {
										props.setUploadedData({
											data: [],
											wasDataModified: false
										});
									}}>
									Use demo data
								</NotificationActionButton>
								{
									props.uploadedData && props.uploadedData.originalData
									&& <NotificationActionButton
										onClick={() => {
											props.setUploadedData({
												data: props.uploadedData.originalData,
												wasDataModified: false
											});
										}}>
										Use unmodified data
									</NotificationActionButton>
								}
							</>
						} />
					: null
			}
			<p>Choose a type of fragment and click done to start editing your new fragment</p>
			<div className='fragment-options'>
				<Col cols={{
					sm: 12,
					md: 12,
					lg: 12
				}}>
					{
						fragments.filter((fragment: any) => (
							fragment.labels && fragment.labels.includes('template')
						)).map((fragment: any) => (
							<div className='modal-tile-wrapper'>
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
											{fragment.lastModified ? fragment.lastModified : 'Last modified date unknown'}
										</span>
									</div>
								</SelectableTile>
							</div>
						))
					}
				</Col>
			</div>
		</Modal>
	);
};
