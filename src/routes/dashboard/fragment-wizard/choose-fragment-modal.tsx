import React, { useContext, useState } from 'react';

import {
	Modal,
	InlineNotification,
	NotificationActionButton
} from 'carbon-components-react';
import { FragmentWizardModals } from './fragment-wizard';

import { GlobalStateContext, NotificationActionType, NotificationContext } from '../../../context';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { warningNotificationProps } from '../../../utils/file-tools';
import { Col } from '../../../components';
import { getFragmentDuplicate, getFragmentTemplates } from '../../../utils/fragment-tools';
import './choose-fragment-modal.scss';
import { ChooseFragmentModalTile } from './choose-fragment-modal-tile';

export interface ChooseFragmentModalProps {
	shouldDisplay: boolean;
	setShouldDisplay: (shouldDisplay: boolean) => void;
	setDisplayedModal: (displayedModal: FragmentWizardModals | null) => void;
	setLastVisitedModal: (lastVisitedModal: FragmentWizardModals) => void;
	lastVisitedModal: FragmentWizardModals;
	uploadedData: any;
	setUploadedData: (uploadedData: any) => void;
}

export const ChooseFragmentModal = (props: ChooseFragmentModalProps) => {
	const [selectedFragment, setSelectedFragment] = useState<any>(null);
	const { fragments, addFragment } = useContext(GlobalStateContext);
	const [, dispatchNotification] = useContext(NotificationContext);

	const navigate: NavigateFunction = useNavigate();

	const generateFragment = () => {
		if (selectedFragment === null) {
			return;
		}

		const fragmentCopy = getFragmentDuplicate(
			fragments,
			selectedFragment,
			// When a new fragment is created from an existing template, it shouldn't
			// be a template by default.
			{ labels: selectedFragment?.labels?.filter((label: string) => label !== 'template') }
		);

		// close all notifications
		dispatchNotification({
			type: NotificationActionType.CLOSE_ALL_NOTIFICATIONS
		});

		addFragment(fragmentCopy);

		navigate(`/edit/${fragmentCopy.id}`);
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
			onRequestClose={() => props.setShouldDisplay(false)}
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
						{...warningNotificationProps}
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
						getFragmentTemplates(fragments).map((fragment: any) => (
							<ChooseFragmentModalTile
								key={fragment.id}
								fragment={fragment}
								selectedFragment={selectedFragment}
								setSelectedFragment={setSelectedFragment} />
						))
					}
				</Col>
			</div>
		</Modal>
	);
};
