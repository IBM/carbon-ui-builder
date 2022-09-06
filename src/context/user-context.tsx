import React, {
	createContext,
	useContext,
	useEffect,
	useState
} from 'react';
import { GithubContext } from './github-context';

const UserContext: React.Context<any> = createContext({});

UserContext.displayName = 'UserContext';

const UserContextProvider = ({ children }: any) => {
	const { token, getUser } = useContext(GithubContext);
	const [userInfo, setUserInfo] = useState({} as any);

	const initUserContext = async () => {
		if (!userInfo.name) { // we didn't fetch initial user info
			const user = await getUser();
			setUserInfo(user || {});
		}
	};

	useEffect(() => {
		initUserContext();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!token) {
			setUserInfo({});
		} else {
			initUserContext();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	return (
		<UserContext.Provider value={{
			isLoggedIn: !!token,
			name: userInfo.name,
			profileImageUrl: userInfo.avatar_url
		}}>
			{children}
		</UserContext.Provider>
	);
};

export {
	UserContext,
	UserContextProvider
};
