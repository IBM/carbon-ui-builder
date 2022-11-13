import React, { useContext, useState } from 'react';
import { Modal, TileGroup, RadioTile } from 'carbon-components-react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { css } from 'emotion';

import { FragmentWizardModals } from './fragment-wizard';
import { generateNewFragment } from './generate-new-fragment';
import { GlobalStateContext, NotificationActionType, NotificationContext } from '../../../context';
import { componentInfo as gridComponentInfo } from '../../../fragment-components/a-grid';
import { initializeIds } from '../../../components';

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
	const [selectedCreateOption, setSelectedCreateOption] = useState<CreateOptions>(CreateOptions.IMPORT_JSON);

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

	const handleChange = (x: CreateOptions) => {
		setSelectedCreateOption(parseInt(CreateOptions[x]));
	}

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
			<TileGroup
				className={createFragmentTiles}
				defaultSelected="IMPORT_JSON"
				name="radio tile group"
				onChange={handleChange}
			>
				<RadioTile
					light={true}
					value="IMPORT_JSON"
					id="tile-1"
					className={createFragmentTileStyle}>
					<div className={tileFooter}>
						<p>Import JSON</p>
					</div>
				</RadioTile>
				<RadioTile
					light={true}
					value="CHOOSE_TEMPLATE"
					id="tile-2"
					className={createFragmentTileStyle}>
					<div className={tileFooter}>
						<p>Pick a template</p>
					</div>
				</RadioTile>
				<RadioTile
					light={true}
					value="EMPTY_FRAGMENT"
					id="tile-3"
					className={createFragmentTileStyle}>
					<div className={tileFooter}>
						<p>Empty fragment</p>
					</div>
				</RadioTile>
				<RadioTile
					light={true}
					value="EMPTY_PAGE"
					id="tile-4"
					className={createFragmentTileStyle}>
					<div className={tileFooter}>
						<p>Empty page (with grid)</p>
					</div>
				</RadioTile>
			</TileGroup>
		</Modal>
	);
};
