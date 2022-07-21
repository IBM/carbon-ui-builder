import React, { useContext, useState } from 'react';
import { Modal } from 'carbon-components-react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { css } from 'emotion';

import { SelectionTile } from '../../../components/selection-tile';
import { FragmentWizardModals } from './fragment-wizard';
import { generateNewFragment } from './generate-new-fragment';
import { GlobalStateContext, NotificationActionType, NotificationContext } from '../../../context';
import { componentInfo as gridComponentInfo } from '../../../fragment-components/a-grid';
import { initializeIds } from '../../../components';

const createFragmentTiles = css`
	display: flex;
	margin-left: 15px;
	margin-right: 15px;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
`;

const createFragmentTileStyle = css`
	width: 48%;
	height: 200px;
	margin-top: 25px;

	.bx--tile {
		height: 100%;
	}
`;

export enum CreateOptions {
	CHOOSE_TEMPLATE,
	EMPTY_FRAGMENT,
	EMPTY_PAGE,
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

	const generateFragment = (items: any[] = []) => {
		const generatedFragment = generateNewFragment(
			{ items, id: 1 }
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
				if (selectedCreateOption === CreateOptions.EMPTY_FRAGMENT) {
					generateFragment();
					props.setShouldDisplay(false);
					return;
				}
				if (selectedCreateOption === CreateOptions.EMPTY_PAGE) {
					generateFragment([initializeIds(gridComponentInfo.defaultComponentObj)]);
					props.setShouldDisplay(false);
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
					styles={createFragmentTileStyle}
					onChange={() => setSelectedCreateOption(CreateOptions.IMPORT_JSON)}
					selected={selectedCreateOption === CreateOptions.IMPORT_JSON}
					label='Import JSON' />
				<SelectionTile
					styles={createFragmentTileStyle}
					onChange={() => setSelectedCreateOption(CreateOptions.CHOOSE_TEMPLATE)}
					selected={selectedCreateOption === CreateOptions.CHOOSE_TEMPLATE}
					label='Pick a template' />
				<SelectionTile
					styles={createFragmentTileStyle}
					onChange={() => setSelectedCreateOption(CreateOptions.EMPTY_FRAGMENT)}
					selected={selectedCreateOption === CreateOptions.EMPTY_FRAGMENT}
					label='Empty fragment' />
				<SelectionTile
					styles={createFragmentTileStyle}
					onChange={() => setSelectedCreateOption(CreateOptions.EMPTY_PAGE)}
					selected={selectedCreateOption === CreateOptions.EMPTY_PAGE}
					label='Empty page (with grid)' />
			</div>
		</Modal>
	);
};
