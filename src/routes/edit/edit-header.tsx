import React, { useContext } from 'react';
import { css } from 'emotion';
import {
	Button,
	Checkbox
} from 'carbon-components-react';
import {
	Copy16,
	Delete16,
	Settings16,
	Share16
} from '@carbon/icons-react';
import { ModalContext, ModalActionType } from '../../context/modal-context';
import { FragmentModal } from './fragment-modal';
import { LocalFragmentsContext, LocalFragmentActionType } from '../../context/local-fragments-context';

const editHeader = css`
	left: 16rem;
	background: #fff;
	box-shadow: inset 0px -1px #d8d8d8;

	.edit-wrapper {
		position: relative;
		display: flex;
		justify-content: space-between;
		.title-wrap {
			height: 3rem;
			margin-left: 3rem;
			display: flex;
			align-self: center;
			flex-flow: column;
		}
		.title-subheading {
			display: inline-flex;
			.bx--inline-loading {
				width: auto;
				position: relative;
				margin-left: 10px;
				top: -10px;
			}
			.date-wrap {
				font-size: 12px;
				font-style: italic;
				color: black;
				padding-left: 12px;
			}
		}
		.fragment-title {
			whitespace: nowrap;
			font-weight: bold;
			padding-left: 12px;
			padding-right: 16px;
			float: left;
		}
		.fragment-edit {
			margin-top: 6px;
			cursor: pointer;
		}
	}

	// This is the viewport width that causes the loading and
	// store to local fragments checkbox to overlap.
	@media screen and (max-width: 67.0625rem) {
		.edit-wrapper {
			.title-subheading {
				flex-flow: column;
				.bx--inline-loading {
					margin-top: 10px;
				}
			}
		}
	}

	// This is the viewport width that causes the store to local
	// fragments checkbox and last modified label to overlap.
	@media screen and (max-width: 58.125rem) {
		.edit-wrapper {
			flex-direction: column;
			.title-wrap {
				margin-top: 10px;
				align-self: auto;
			}
			.title-subheading {
				flex-direction: row;
				.bx--inline-loading {
					margin-top: 0px;
				}
			}
		}
	}

	// This is the viewport width that causes the loading and store
	// to local fragments to be disfigured.
	@media screen and (max-width: 42.6875rem) {
		.edit-wrapper {
			.title-subheading {
				flex-direction: column;
				.bx--inline-loading {
					margin-top: 10px;
				}
			}
		}
	}
`;

const toolBarAction = css`
	background: #f4f4f4;
	margin-right: 13px;
`;

const fragmentEditToolBar = css`
	display: flex;
	margin-right: 2rem;
	margin-top: 8px;
	margin-bottom: 8px;
	button {
		height: 3rem;
	}
	.toolBarButtons {
		min-width: 13.75rem
	}
	// This is the viewport width that causes the store to local
	// fragments checkbox and last modified label to overlap.
	@media screen and (max-width: 58.125rem) {
		margin-left: 10px;
		flex-direction: row-reverse;
		place-self: start;
	}
	// This is the viewport width that causes the loading and store
	// to local fragments to be disfigured.
	@media screen and (max-width: 42.6875rem) {
		margin-left: 10px;
		margin-top: 20px;
		flex-direction: column-reverse;
		place-self: start;
	}
`;

export const EditHeader = ({ fragment }: any) => {
	const [, dispatchModal] = useContext(ModalContext);
	const [localFragments, updateLocalFragments] = useContext(LocalFragmentsContext);

	return (
		<header
			className={editHeader}
			aria-label={`Header for '${fragment.title}'`}
			role='banner'
			tabIndex={0}>
			<div className='edit-wrapper'>
				<div className='title-wrap'>
					<p className='fragment-title'>{fragment.title}</p>

					<div className='title-subheading'>
						<div className='date-wrap'>{`Last modified ${ fragment.lastModified}`}</div>
					</div>
				</div>
				<div className={fragmentEditToolBar}>
					<div className='toolBarButtons'>
						<Button
							kind='ghost'
							aria-label='Duplicate fragment'
							title='Duplicate fragment'
							onClick={() => dispatchModal({
								type: ModalActionType.setDuplicationModal,
								id: fragment.id
							})}
							className={toolBarAction}>
							<Copy16 fill="black" />
						</Button>
						<Button
							kind='ghost'
							aria-label='Delete fragment'
							title='Delete fragment'
							onClick={() => dispatchModal({
								type: ModalActionType.setDeletionModal,
								id: fragment.id
							})}
							className={toolBarAction}>
							<Delete16 fill="black" />
						</Button>
						<Button
							kind='ghost'
							aria-label='Share fragment'
							title='Share fragment'
							onClick={() => dispatchModal({
								type: ModalActionType.setShareModal,
								id: fragment.id
							})}
							className={toolBarAction}>
							<Share16 fill="black" />
						</Button>
						<Button
							kind='ghost'
							aria-label='Fragment settings'
							title='Fragment settings'
							onClick={() => dispatchModal({
								type: ModalActionType.setSettingsModal,
								id: fragment.id
							})}
							className={toolBarAction}>
							<Settings16 fill="black" />
						</Button>
					</div>
				</div>
			</div>
			<FragmentModal fragment={fragment} />
		</header>
	);
};
