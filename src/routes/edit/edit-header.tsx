import React, { useContext, useRef, useState } from 'react';
import { css } from 'emotion';
import { Button, TextInput } from 'carbon-components-react';
import {
	Checkmark16,
	Copy16,
	Delete16,
	Edit16,
	Export16,
	Undo16,
	Redo16,
	ChevronLeft24
} from '@carbon/icons-react';
import { ModalContext, ModalActionType } from '../../context/modal-context';
import { FragmentModal } from './fragment-modal';
import { GlobalStateContext } from '../../context';
import { actionIconStyle } from '.';
import { NavigateFunction, useNavigate } from 'react-router-dom';

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
			margin-left: 0;
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
			line-height: 2rem;

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

const toolBarSeparator = css`
	background-color: #e0e0e0;
	height: 100%;
	width: 1px;
	display: inline-block;
    margin: auto 6px;
`;

const fragmentEditToolBar = css`
	display: flex;
	margin-right: 5rem;
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

export const EditHeader = ({ fragment, setFragment }: any) => {
	const navigate: NavigateFunction = useNavigate();
	const [, dispatchModal] = useContext(ModalContext);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const titleTextInputRef = useRef(null as any);
	const {
		canUndo,
		undoAction,
		canRedo,
		redoAction
	} = useContext(GlobalStateContext);

	return (
		<header
			className={editHeader}
			aria-label={`Header for '${fragment.title}'`}
			role='banner'
			tabIndex={0}>
			<div className='edit-wrapper'>
				<div className={css`display: flex;`}>
					<Button
						kind='ghost'
						aria-label='Back to dashboard'
						title='Back to dashboard'
						onClick={() => navigate('/')}>
						<ChevronLeft24 className={actionIconStyle} />
					</Button>
					<div className='title-wrap'>
						<p className='fragment-title'>
							{
								<div className={isEditingTitle ? css`display: inline-block` : css`display: none`}>
									<TextInput
										ref={titleTextInputRef}
										value={fragment.title}
										onChange={(event: any) => setFragment({ ...fragment, title: event.target.value })}
										onKeyDown={(event: any) => {
											if (event.key === 'Enter') {
												setIsEditingTitle(false);
											}
										}}
										onBlur={() => setIsEditingTitle(false)}
										size='sm'
										light={true} />
								</div>
							}
							{ !isEditingTitle && fragment.title }
							<Button
								kind='ghost'
								size='sm'
								hasIconOnly
								renderIcon={isEditingTitle ? Checkmark16 : Edit16}
								onClick={() => {
									setIsEditingTitle(!isEditingTitle);
									// isEditingTitle won't be changed until next render so checking for opposite
									if (!isEditingTitle) {
										setTimeout(() => {
											titleTextInputRef.current?.focus();
										});
									}
								}} />
						</p>

						<div className='title-subheading'>
							<div className='date-wrap'>{`Last modified ${ fragment.lastModified}`}</div>
						</div>
					</div>
				</div>
				<div className={fragmentEditToolBar}>
					<div className='toolBarButtons'>
						<Button
							kind='ghost'
							aria-label='Undo'
							title='Undo'
							disabled={!canUndo()}
							onClick={() => undoAction()}>
							<Undo16 className={actionIconStyle} />
						</Button>
						<Button
							kind='ghost'
							aria-label='Redo'
							title='Redo'
							disabled={!canRedo()}
							onClick={() => redoAction()}>
							<Redo16 className={actionIconStyle} />
						</Button>
						<div className={toolBarSeparator} />
						<Button
							kind='ghost'
							aria-label='Duplicate fragment'
							title='Duplicate fragment'
							onClick={() => dispatchModal({
								type: ModalActionType.setDuplicationModal,
								id: fragment.id
							})}>
							<Copy16 className={actionIconStyle} />
						</Button>
						<Button
							kind='ghost'
							aria-label='Delete fragment'
							title='Delete fragment'
							onClick={() => dispatchModal({
								type: ModalActionType.setDeletionModal,
								id: fragment.id
							})}>
							<Delete16 className={actionIconStyle} />
						</Button>
						<Button
							kind='primary'
							aria-label='Export fragment'
							title='Export fragment'
							renderIcon={Export16}
							onClick={() => dispatchModal({
								type: ModalActionType.setExportModal,
								id: fragment.id
							})}>
							Export
						</Button>
					</div>
				</div>
			</div>
			<FragmentModal fragment={fragment} />
		</header>
	);
};
