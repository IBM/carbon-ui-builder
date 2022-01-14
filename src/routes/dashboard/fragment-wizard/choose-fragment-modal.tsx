import React, { useContext, useState } from 'react';

import { css } from 'emotion';
import {
	Modal,
	InlineNotification,
	NotificationActionButton,
	SelectableTile
} from 'carbon-components-react';
import { FragmentWizardModals } from './fragment-wizard';

import {
	FragmentActionType,
	FragmentAction,
	FragmentState,
	FragmentsContext
} from '../../../context';
import { useHistory } from 'react-router-dom';
import { LocalFragmentsContext, LocalFragmentActionType } from '../../../context/local-fragments-context';
import { warningNotificationProps } from '../../../utils/file-tools';
import { Col } from '../../../components';
import { FragmentPreview } from '../../../components/fragment-preview';
import { duplicateFragment } from '../../../utils/fragment-tools';

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
const tileWrapper = css`
	position: relative;
	margin: 0.75rem;
	padding: 0;
	height: 240px;
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

export interface ChooseFragmentModalProps {
	shouldDisplay: boolean,
	setShouldDisplay: (shouldDisplay: boolean) => void,
	setDisplayedModal: (displayedModal: FragmentWizardModals | null) => void,
	setLastVisitedModal: (lastVisitedModal: FragmentWizardModals) => void,
	lastVisitedModal: FragmentWizardModals,
	uploadedData: any,
	setUploadedData: (uploadedData: any) => void,
	dispatch: (fragmentAction: FragmentAction) => FragmentState
}

export const ChooseFragmentModal = (props: ChooseFragmentModalProps) => {
	const [, updateLocalFragments] = useContext(LocalFragmentsContext);
	const [fragmentsState, dispatch] = useContext(FragmentsContext);
	const [selectedFragment, setSelectedFragment] = useState<any>(null);

	const history = useHistory();

	const generateFragment = () => {
		if (fragmentsState.currentlyProcessing || selectedFragment === null) {
			return;
		}

		const fragmentCopy = duplicateFragment(
			fragmentsState.fragments,
			selectedFragment,
			{ labels: selectedFragment?.labels?.filter((label: string) => label !== 'template') }
		);

		dispatch({
			type: FragmentActionType.ADD_ONE,
			data: fragmentCopy,
			loaded: true
		});
		updateLocalFragments({
			type: LocalFragmentActionType.ADD,
			data: { id: fragmentCopy.id }
		});
		history.push(`/edit/${fragmentCopy.id}`);
	}

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
			<div className={fragmentOptions}>
				<Col cols={{
					sm: 12,
					md: 12,
					lg: 12
				}}>
					{
						fragmentsState.fragments.filter((fragment: any) => (
							fragment.labels && fragment.labels.includes('template')
						)).map((fragment: any) => (
							<div className={tileWrapper}>
								<SelectableTile
									className={tileStyle}
									onClick={() => setSelectedFragment(fragment)}
									selected={fragment === selectedFragment}>
									<div className={tileInnerWrapper}>
										<FragmentPreview fragment={fragment} />
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
