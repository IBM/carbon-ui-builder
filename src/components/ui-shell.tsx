import React from 'react';
import { HeaderContainer } from 'carbon-components-react';
import { Header } from '../components/index';

export const UIShell = () => {
	return (
		<HeaderContainer
			render={() => (
				<Header />
			)}
		/>
	);
};
