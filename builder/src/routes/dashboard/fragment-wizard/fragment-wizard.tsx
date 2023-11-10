import React, { useState } from 'react';

import { CreateFragmentModal } from './create-fragment-modal';
import { ChooseFragmentModal } from './choose-fragment-modal';
import { ImportJsonModal } from './import-json-modal';

export enum FragmentWizardModals {
	CREATE_FRAGMENT_MODAL,
	CHOOSE_FRAGMENT_MODAL,
	IMPORT_JSON_MODAL
}

export const FragmentWizard = ({
	shouldDisplay,
	setShouldDisplay,
	displayedModal,
	setDisplayedModal
}: any) => {
	// This is used to indicate which modal was last visited and is used to go go back to the
	// correct previous modal.
	const [lastVisitedModal, setLastVisitedModal]
		= useState<FragmentWizardModals>(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
	const [uploadedData, setUploadedData] = useState<any>({});

	const modalSwitcher = () => {
		if (!shouldDisplay) {
			return null;
		}
		switch (displayedModal) {
			case FragmentWizardModals.IMPORT_JSON_MODAL:
				return (
					<ImportJsonModal
						shouldDisplay={shouldDisplay}
						setShouldDisplay={setShouldDisplay}
						setDisplayedModal={setDisplayedModal}
						lastVisitedModal={lastVisitedModal}
						setLastVisitedModal={setLastVisitedModal}
						uploadedData={uploadedData}
						setUploadedData={setUploadedData} />
				);
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
						setUploadedData={setUploadedData} />
				);
			default:
				return null;
		}
	};

	return modalSwitcher();
};
