import React, { useState } from 'react';

import { CreateFragmentModal } from './create-fragment-modal';
import { ChooseFragmentModal } from './choose-fragment-modal';

export enum FragmentWizardModals {
	CREATE_FRAGMENT_MODAL,
	CHOOSE_FRAGMENT_MODAL
}

export const FragmentWizard = ({ shouldDisplay, setShouldDisplay, dispatch }: any) => {
	// These are states which are shared amongst the three modals.
	const [displayedModal, setDisplayedModal]
		= useState<FragmentWizardModals | null>(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
	// This is used to indicate which modal was last visited and is used to go go back to the
	// correct previous modal.
	const [lastVisitedModal, setLastVisitedModal]
		= useState<FragmentWizardModals>(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
	const [uploadedData, setUploadedData] = useState<any>({});

	const modalSwitcher = () => {
		if (!shouldDisplay) {
			return null;
		}
		switch(displayedModal) {
			case FragmentWizardModals.CREATE_FRAGMENT_MODAL:
				return (
					<CreateFragmentModal
						shouldDisplay={shouldDisplay}
						setShouldDisplay={setShouldDisplay}
						setDisplayedModal={setDisplayedModal}
						setLastVisitedModal={setLastVisitedModal} />
				);
			case FragmentWizardModals.CHOOSE_FRAGMENT_MODAL:
				return (
					<ChooseFragmentModal
						shouldDisplay={shouldDisplay}
						setShouldDisplay={setShouldDisplay}
						setDisplayedModal={setDisplayedModal}
						lastVisitedModal={lastVisitedModal}
						setLastVisitedModal={setLastVisitedModal}
						uploadedData={uploadedData}
						setUploadedData={setUploadedData}
						dispatch={dispatch} />
				);
			default:
				return null;
		}
	};

	return modalSwitcher();
};
