import React from 'react';
import { HeaderContainer } from '@carbon/react';
import { Header } from '../components/index';

export const UIShell = ({
	setDisplayedModal,
	displayWizard,
	setDisplayWizard
}: any) => {
	return (
		<HeaderContainer
			render={() => (
				<Header
					setDisplayedModal={setDisplayedModal}
					displayWizard={displayWizard}
					setDisplayWizard={setDisplayWizard} />
			)}
		/>
	);
};
