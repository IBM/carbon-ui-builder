import React, { useState } from 'react';
import { HeaderContainer } from 'carbon-components-react';
import { Header } from '../components/index';

export const UIShell = () => {
	const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);

	return (
		<HeaderContainer
			render={() => (
				<>
					<Header
						isSideNavExpanded={isSideNavExpanded}
						setIsSideNavExpanded={setIsSideNavExpanded} />
				</>
			)} />
	);
};
