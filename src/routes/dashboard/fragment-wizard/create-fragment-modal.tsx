import React, { useContext, useState } from 'react';
import { Modal, TileGroup, RadioTile } from 'carbon-components-react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { css } from 'emotion';

import { FragmentWizardModals } from './fragment-wizard';
import { generateNewFragment } from './generate-new-fragment';
import { GlobalStateContext, NotificationActionType, NotificationContext } from '../../../context';
import { componentInfo as gridComponentInfo } from '../../../sdk/src/fragment-components/a-grid';
import { initializeIds } from '../../../sdk/src/tools';

const createFragmentTiles = css`
	div {
		display: flex;
		margin-left: 15px;
		margin-right: 15px;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}
`;

const createFragmentTileStyle = css`
	width: 48%;
	height: 200px;
	margin-top: 25px;

	.bx--tile {
		height: 100%;
	}
`;

const tileFooter = css`
	position: absolute;
	display: flex;
	width: 100%;
	justify-content: space-between;
	bottom: 15px;

	p {
		font-weight: bold;
	}

	span {
		margin-right: 30px;
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
	const [selectedCreateOption, setSelectedCreateOption] = useState<CreateOptions>(CreateOptions.EMPTY_PAGE);

	const { addFragment, styleClasses, setStyleClasses } = useContext(GlobalStateContext);
	const [, dispatchNotification] = useContext(NotificationContext);

	const navigate: NavigateFunction = useNavigate();

	const generateFragment = (items: any[] = []) => {
		const generatedFragment = generateNewFragment(
			{ items, id: 1 },
			styleClasses,
			setStyleClasses
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
			selectorPrimaryFocus='[for="empty-page"]'
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
			<TileGroup
				className={createFragmentTiles}
				defaultSelected={CreateOptions.EMPTY_PAGE}
				name="Fragment creation"
				onChange={setSelectedCreateOption}>
				<RadioTile
					light={true}
					value={CreateOptions.IMPORT_JSON}
					id="import-json"
					className={createFragmentTileStyle}>
					<div className={tileFooter}>
						<p>Import JSON</p>
					</div>
				</RadioTile>
				<RadioTile
					light={true}
					value={CreateOptions.CHOOSE_TEMPLATE}
					id="choose-template"
					className={createFragmentTileStyle}>
					<div className={tileFooter}>
						<p>Pick a template</p>
					</div>
				</RadioTile>
				<RadioTile
					light={true}
					value={CreateOptions.EMPTY_FRAGMENT}
					id="empty-fragment"
					className={createFragmentTileStyle}>
					<div className={tileFooter}>
						<p>Empty fragment</p>
					</div>
				</RadioTile>
				<RadioTile
					light={true}
					value={CreateOptions.EMPTY_PAGE}
					id="empty-page"
					className={createFragmentTileStyle}>
					<div className={tileFooter}>
						<p>Empty page (with grid)</p>
					</div>
				</RadioTile>
			</TileGroup>
		</Modal>
	);
};
