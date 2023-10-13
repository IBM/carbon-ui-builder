import React, { createContext, useState } from 'react';

const ModalContext: React.Context<any> = createContext({});

ModalContext.displayName = 'ModalContext';

const ModalContextProvider = ({ children }: any) => {
	// /////////////////////
	//    Generic modal   //
	// /////////////////////
	const [modalState, setModalState] = useState({
		isVisible: false,
		component: <div></div>,
		props: {}
	} as any);

	const showModal = (modalComponent: any, modalProps: any = {}, componentProps?: any) => {
		setModalState({
			...modalProps,
			isVisible: true,
			component: modalComponent,
			props: componentProps
		});
	};

	const hideModal = () => {
		setModalState({
			...modalState,
			isVisible: false
		});
	};

	// /////////////////////////////
	//    Delete fragment modal   //
	// /////////////////////////////
	const [fragmentDeleteModalState, setFragmentDeleteModalState] = useState({
		isVisible: false
	} as any);

	const showFragmentDeleteModal = (id: string | number) => {
		setFragmentDeleteModalState({
			isVisible: true,
			fragmentId: id
		});
	};

	const hideFragmentDeleteModal = () => {
		setFragmentDeleteModalState({
			isVisible: false
		});
	};

	// /////////////////////////////
	//    Duplicate fragment modal   //
	// /////////////////////////////
	const [fragmentDuplicateModalState, setFragmentDuplicateModalState] = useState({
		isVisible: false
	} as any);

	const showFragmentDuplicateModal = (fragment: any) => {
		setFragmentDuplicateModalState({
			isVisible: true,
			fragment
		});
	};

	const hideFragmentDuplicateModal = () => {
		setFragmentDuplicateModalState({
			isVisible: false
		});
	};

	// /////////////////////////////
	//    Export fragment modal   //
	// /////////////////////////////
	const [fragmentExportModalState, setFragmentExportModalState] = useState({
		isVisible: false
	} as any);

	const showFragmentExportModal = (fragment: any) => {
		setFragmentExportModalState({
			isVisible: true,
			fragment
		});
	};

	const hideFragmentExportModal = () => {
		setFragmentExportModalState({
			...fragmentExportModalState,
			isVisible: false
		});
	};

	// /////////////////////////////
	//    Preview fragment modal   //
	// /////////////////////////////
	const [fragmentPreviewModalState, setFragmentPreviewModalState] = useState({
		isVisible: false
	} as any);

	const showFragmentPreviewModal = (fragment: any, fragments: any[], isFeaturedFragment: false) => {
		setFragmentPreviewModalState({
			isVisible: true,
			fragment,
			fragments,
			isFeaturedFragment
		});
	};

	const hideFragmentPreviewModal = () => {
		setFragmentPreviewModalState({
			...fragmentPreviewModalState,
			isVisible: false
		});
	};

	// /////////////////////////////
	//    Login github modal   //
	// /////////////////////////////
	const [loginGithubModalState, setLoginGithubModalState] = useState({
		isVisible: false
	} as any);

	const showLoginGithubModal = () => {
		setLoginGithubModalState({
			isVisible: true
		});
	};

	const hideLoginGithubModal = () => {
		setLoginGithubModalState({
			isVisible: false
		});
	};

	// /////////////////////////////
	//    Logout github modal   //
	// /////////////////////////////
	const [logoutGithubModalState, setLogoutGithubModalState] = useState({
		isVisible: false
	} as any);

	const showLogoutGithubModal = () => {
		setLogoutGithubModalState({
			isVisible: true
		});
	};

	const hideLogoutGithubModal = () => {
		setLogoutGithubModalState({
			isVisible: false
		});
	};

	// /////////////////////////////
	//    Logout github modal   //
	// /////////////////////////////
	const [customComponentsModalState, setCustomComponentsModalState] = useState({
		isVisible: false
	} as any);

	const showCustomComponentsModal = () => {
		setCustomComponentsModalState({
			isVisible: true
		});
	};

	const hideCustomComponentsModal = () => {
		setCustomComponentsModalState({
			isVisible: false
		});
	};

	return (
		<ModalContext.Provider value={{
			modal: modalState,
			showModal,
			hideModal,

			fragmentDeleteModal: fragmentDeleteModalState,
			showFragmentDeleteModal,
			hideFragmentDeleteModal,

			fragmentDuplicateModal: fragmentDuplicateModalState,
			showFragmentDuplicateModal,
			hideFragmentDuplicateModal,

			fragmentExportModal: fragmentExportModalState,
			showFragmentExportModal,
			hideFragmentExportModal,

			fragmentPreviewModal: fragmentPreviewModalState,
			showFragmentPreviewModal,
			hideFragmentPreviewModal,

			loginGithubModal: loginGithubModalState,
			showLoginGithubModal,
			hideLoginGithubModal,

			logoutGithubModal: logoutGithubModalState,
			showLogoutGithubModal,
			hideLogoutGithubModal,

			customComponentsModal: customComponentsModalState,
			showCustomComponentsModal,
			hideCustomComponentsModal
		}}>
			{children}
		</ModalContext.Provider>
	);
};

export {
	ModalContext,
	ModalContextProvider
};
