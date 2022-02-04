import React, { createContext, useState } from 'react';

const StylesContext: React.Context<any> = createContext(null);

StylesContext.displayName = 'StylesContext';

const StylesContextProvider = ({ children }: any) => {
	const [styleClasses, _setStyleClasses] = useState(JSON.parse(localStorage.getItem('globalStyleClasses') as string || '[]') as any[]);

	const setStyleClasses = (sc: any) => {
		localStorage.setItem('globalStyleClasses', JSON.stringify(sc))
		_setStyleClasses(sc);
	};

	return (
		<StylesContext.Provider value={{styleClasses, setStyleClasses}}>
			{children}
		</StylesContext.Provider>
	);
};

export {
	StylesContext,
	StylesContextProvider
};

