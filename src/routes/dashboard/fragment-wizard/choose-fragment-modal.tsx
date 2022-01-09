import React, { useContext } from 'react';

import { css } from 'emotion';
import {
	Modal,
	InlineNotification,
	NotificationActionButton
} from 'carbon-components-react';
import { FragmentWizardModals } from './fragment-wizard';
import { generateNewFragment } from './generate-new-fragment';

import { FragmentsContext } from '../../../context';
import { useHistory } from 'react-router-dom';
import { LocalFragmentsContext, LocalFragmentActionType } from '../../../context/local-fragments-context';
import { warningNotificationProps } from '../../../utils/file-tools';

const fragmentOptions = css`
	margin-left: 30px;
	margin-right: 30px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;

	// This is the viewport width that causes the selection tiles to overlap.
	@media screen and (max-width: 45rem) {
		flex-direction: column;
	}
`;

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
	const [, updateLocalFragments] = useContext(LocalFragmentsContext);
	const { addOne } = useContext(FragmentsContext);

	const history = useHistory();

	const generateFragment = () => {
		const generatedFragment = generateNewFragment(
			props.uploadedData.data
		);

		addOne(generatedFragment);
		updateLocalFragments({
			type: LocalFragmentActionType.ADD,
			data: { id: generatedFragment.id }
		});
		history.push(`/edit/${generatedFragment.id}`);
	};

	return (
		<Modal
			open={props.shouldDisplay}
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
			<div className={fragmentOptions}>
				Empty
			</div>
		</Modal>
	);
};
