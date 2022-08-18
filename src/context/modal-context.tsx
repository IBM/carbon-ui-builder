import React, { createContext, useReducer } from 'react';

const ModalContext: React.Context<any> = createContext({});

ModalContext.displayName = 'ModalContext';

export enum ModalActionType {
	setDuplicationModal,
	setDeletionModal,
	setExportModal,
	setPreviewModal,
	closeModal
}

export enum ModalType {
	DUPLICATION,
	DELETION,
	EXPORT,
	PREVIEW
}

export type ModalAction = BaseModalAction;

export interface BaseModalAction {
	type: ModalActionType;
	id?: string;
	fragment?: any;
	fragments?: any[];
	isFeaturedFragment?: boolean;
}

export interface ModalState {
	ShowModal: boolean;
	ModalType: any;
	FragmentID?: string;
	fragment?: any;
	fragments?: any[];
	isFeaturedFragment?: boolean;
}

const initialState = {
	ShowModal: false,
	ModalType: null,
	FragmentID: ''
};

const modalReducer = (state: ModalState, action: BaseModalAction) => {
	switch (action.type) {
		case ModalActionType.setDuplicationModal:
			return {
				...state,
				ShowModal: true,
				ModalType: ModalType.DUPLICATION,
				FragmentID: action.id
			};
		case ModalActionType.setDeletionModal:
			return {
				...state,
				ShowModal: true,
				ModalType: ModalType.DELETION,
				FragmentID: action.id
			};
		case ModalActionType.setExportModal:
			return {
				...state,
				ShowModal: true,
				ModalType: ModalType.EXPORT,
				FragmentID: action.id
			};
		case ModalActionType.setPreviewModal:
			return {
				...state,
				ShowModal: true,
				ModalType: ModalType.PREVIEW,
				fragments: action.fragments,
				fragment: action.fragment,
				isFeaturedFragment: action.isFeaturedFragment
			};
		case ModalActionType.closeModal:
			return {
				...state,
				ShowModal: false
			};
		default:
			return state;
	}
};

const ModalContextProvider = ({ children }: any) => {
	const modal = useReducer(modalReducer, initialState);

	return (
		<ModalContext.Provider value={modal}>
			{children}
		</ModalContext.Provider>
	);
};

export {
	ModalContext,
	ModalContextProvider
};
