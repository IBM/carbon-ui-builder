import React, { useContext, useState } from 'react';

import { FragmentWizardModals } from './fragment-wizard';

import { Modal } from 'carbon-components-react';
import { css } from 'emotion';
import { SelectionTile } from '../../../components/selection-tile';
import { generateNewFragment } from './generate-new-fragment';
import { GlobalStateContext, NotificationActionType, NotificationContext } from '../../../context';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const createFragmentTiles = css`
	display: flex;
	margin-top: 30px;
	margin-left: 15px;
	margin-right: 15px;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
`;

const createFragmentTile = css`
	width: 48%;
	height: 200px;
	.bx--tile {
		height: 100%;
	}
`;

export enum CreateOptions {
	CHOOSE_TEMPLATE,
	FROM_SCRATCH,
	IMPORT_JSON
}

export interface CreateFragmentModalProps {
	shouldDisplay: boolean;
	setShouldDisplay: (shouldDisplay: boolean) => void;
	setDisplayedModal: (displayedModal: FragmentWizardModals | null) => void;
	setLastVisitedModal: (lastVisitedModal: FragmentWizardModals) => void;
}

export const CreateFragmentModal = (props: CreateFragmentModalProps) => {
	const [selectedCreateOption, setSelectedCreateOption] = useState<CreateOptions | null>(null);

	const { addFragment } = useContext(GlobalStateContext);
	const [, dispatchNotification] = useContext(NotificationContext);

	const navigate: NavigateFunction = useNavigate();

	const generateFragment = () => {
		const generatedFragment = generateNewFragment(
			{ items: [], id: 1 }
		);

		// close all notifications
		dispatchNotification({
			type: NotificationActionType.CLOSE_ALL_NOTIFICATIONS
		});

		addFragment(generatedFragment);

		navigate(`/edit/${generatedFragment.id}`);
	};

	return (
		<Modal
			open={props.shouldDisplay}
			hasForm
			shouldSubmitOnEnter={false}
			selectorPrimaryFocus='.bx--tile--selectable'
			onSecondarySubmit={() => {
				props.setShouldDisplay(false);
				props.setLastVisitedModal(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
			}}
			onRequestSubmit={() => {
				if (selectedCreateOption === CreateOptions.IMPORT_JSON) {
					// open modal with file upload
					props.setDisplayedModal(FragmentWizardModals.IMPORT_JSON_MODAL);
					props.setLastVisitedModal(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
					return;
				}
				if (selectedCreateOption === CreateOptions.FROM_SCRATCH) {
					generateFragment();
					return;
				}
				props.setDisplayedModal(FragmentWizardModals.CHOOSE_FRAGMENT_MODAL);
				props.setLastVisitedModal(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
			}}
			onRequestClose={() => {
				props.setShouldDisplay(false);
				props.setLastVisitedModal(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
			}}
			modalHeading='Create new fragment'
			primaryButtonText='Next'
			primaryButtonDisabled={selectedCreateOption === null}
			secondaryButtonText='Cancel'>
			<p>Start with a template or create a new fragment from scratch.</p>
			<div className={createFragmentTiles}>
				<SelectionTile
					styles={createFragmentTile}
					onChange={() => setSelectedCreateOption(CreateOptions.IMPORT_JSON)}
					selected={selectedCreateOption === CreateOptions.IMPORT_JSON}
					label='Import JSON' />
				<SelectionTile
					styles={createFragmentTile}
					onChange={() => setSelectedCreateOption(CreateOptions.CHOOSE_TEMPLATE)}
					selected={selectedCreateOption === CreateOptions.CHOOSE_TEMPLATE}
					label='Pick a template' />
				<SelectionTile
					styles={createFragmentTile}
					onChange={() => setSelectedCreateOption(CreateOptions.FROM_SCRATCH)}
					selected={selectedCreateOption === CreateOptions.FROM_SCRATCH}
					label='Start from scratch' />
			</div>
		</Modal>
	);
};
