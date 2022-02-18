import React, { useState, useContext } from 'react';
import {
	Modal,
	TextInput,
	Checkbox,
	TooltipDefinition
} from 'carbon-components-react';
import { ModalActionType, ModalContext } from '../../context/modal-context';
import { GlobalStateContext } from '../../context/global-state-context';
import './fragment-modal.scss';

export const SettingsFragmentModal = ({ fragment }: any) => {
	const [modalState, dispatchModal] = useContext(ModalContext);
	const { updateFragment } = useContext(GlobalStateContext);

	const props = {
		size: 'sm',
		open: modalState.ShowModal,
		onRequestClose: () => dispatchModal({ type: ModalActionType.closeModal }),
		secondaryButtonText: 'Cancel'
	};

	const [title, setTitle] = useState(fragment.title);
	const [isTemplate, setIsTemplate] = useState(fragment.labels && fragment.labels.includes('template'));
	const [isMicroLayout, setIsMicroLayout] = useState(fragment.labels && fragment.labels.includes('micro-layout'));

	const updateFragmentSettings = () => {
		let labels = fragment.labels || [];

		// Add or remove 'template' label for the fragment if set template is checked
		if (isTemplate) {
			if(!labels.includes('template')) {
				labels = [...labels, 'template'];
			}
		} else {
			// if the set template is unchecked, remove the 'template' label
			labels = labels.filter((label: string) => label !== 'template');
		}

		// Add or remove 'micro-layout' label for the fragment if set micro-layout is checked
		if (isMicroLayout) {
			if(!labels.includes('micro-layout')) {
				labels = [...labels, 'micro-layout'];
			}
		} else {
			// if the set micro-layout is unchecked, remove the 'micro-layout' label
			labels = labels.filter((label: string) => label !== 'micro-layout');
		}

		updateFragment({
			...fragment,
			title,
			labels
		});

		dispatchModal({ type: ModalActionType.closeModal });
	};

	return (
		<Modal
			{...props}
			hasForm
			modalHeading='Edit fragment settings'
			primaryButtonText='Save'
			onRequestSubmit={() => updateFragmentSettings()} >
			<TextInput
				id='fragmentName'
				labelText='Fragment name'
				defaultValue={title}
				onChange={(event: any) => setTitle(event.target.value)}/>

			<Checkbox
				id='setFragmentAsTemplate'
				checked={isTemplate}
				labelText='Make this fragment a &nbsp;'
				onChange={(event: any) => setIsTemplate(event)}/>
			<TooltipDefinition
				tooltipText='Setting a fragment as a template makes it an easy starting point
				for future fragments.'
				direction='bottom'>
				template
			</TooltipDefinition>
			<br />
			<Checkbox
				id='setFragmentAsMicroLayout'
				checked={isMicroLayout}
				labelText='Make this fragment a &nbsp;'
				onChange={(event: any) => setIsMicroLayout(event)}/>
			<TooltipDefinition
				tooltipText='Setting a fragment as a micro layout makes it available to drag and drop into fragments'
				direction='bottom'>
				micro layout
			</TooltipDefinition>
		</Modal>
	);
};
