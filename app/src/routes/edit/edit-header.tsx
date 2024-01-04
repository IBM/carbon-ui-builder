import React, { useContext, useRef, useState } from 'react';
import { css } from 'emotion';
import { Button, TextInput } from '@carbon/react';
import {
	Checkmark,
	ChevronLeft,
	Copy,
	DocumentExport,
	Edit,
	IntentRequestInactive,
	IntentRequestActive,
	IntentRequestUninstall,
	Redo,
	TrashCan,
	Undo,
	View
} from '@carbon/react/icons';
import { ModalContext } from '../../context/modal-context';
import { GlobalStateContext } from '../../context';
import { actionIconStyle } from '@carbon-builder/sdk-react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { openFragmentPreview } from '../../utils/fragment-tools';

const editHeader = css`
	left: 16rem;
	background-color: #fff;
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
			.cds--inline-loading {
				width: auto;
				position: relative;
				margin-left: 10px;
				top: -10px;
			}
			.date-wrap {
				font-size: 12px;
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
				.cds--inline-loading {
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
				.cds--inline-loading {
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
				.cds--inline-loading {
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
	margin-right: 1rem;
	margin-top: 8px;
	margin-bottom: 8px;
	button {
		height: 3rem;
	}
	.toolBarButtons {
		min-width: 13.75rem;
		display: inherit;
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
	const {
		showFragmentDuplicateModal,
		showFragmentDeleteModal,
		showFragmentExportModal
	} = useContext(ModalContext);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const titleTextInputRef = useRef(null as any);
	const {
		canUndo,
		undoAction,
		canRedo,
		redoAction
	} = useContext(GlobalStateContext);

	const getOutlineHelperText = (outline: boolean | null) => {
		if (outline === true) {
			return 'Outline (forced on)';
		}
		if (outline === false) {
			return 'Outline (forced off)';
		}
		return 'Outline (inheriting)';
	};

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
						<ChevronLeft size={24} className={actionIconStyle} />
					</Button>
					<div className='title-wrap'>
						<div className='fragment-title'>
							{
								<div className={isEditingTitle ? css`display: inline-block` : css`display: none`}>
									<TextInput
										id='fragment-title-text-input'
										labelText=''
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
								renderIcon={isEditingTitle ? Checkmark : Edit }
								iconDescription={isEditingTitle ? 'Mark done' : 'Edit title'}
								tooltipPosition='bottom'
								onClick={() => {
									setIsEditingTitle(!isEditingTitle);
									// isEditingTitle won't be changed until next render so checking for opposite
									if (!isEditingTitle) {
										setTimeout(() => {
											titleTextInputRef.current?.focus();
										});
									}
								}} />
						</div>

						<div className='title-subheading'>
							<div className='date-wrap'>{`Last modified ${fragment.lastModified}`}</div>
						</div>
					</div>
				</div>
				<div className={fragmentEditToolBar}>
					<div className='toolBarButtons'>
						<Button
							kind='ghost'
							hasIconOnly
							tooltipPosition='bottom'
							iconDescription={getOutlineHelperText(fragment.outline)}
							onClick={() => setFragment({ ...fragment, outline: fragment.outline === false ? null : !fragment.outline })}
							renderIcon={() => {
								if (fragment.outline === true) {
									return <IntentRequestActive size={20} className={actionIconStyle} />;
								}

								if (fragment.outline === false) {
									return <IntentRequestUninstall size={20} className={actionIconStyle} />;
								}

								return <IntentRequestInactive size={20} className={actionIconStyle} />;
							}} />
						<Button
							kind='ghost'
							hasIconOnly
							tooltipPosition='bottom'
							iconDescription='Preview fragment'
							onClick={() => openFragmentPreview(fragment)}
							renderIcon={() => <View size={16} className={actionIconStyle} />} />
						<div className={toolBarSeparator} />
						<Button
							kind='ghost'
							hasIconOnly
							tooltipPosition='bottom'
							iconDescription='Undo'
							disabled={!canUndo()}
							onClick={() => undoAction()}
							renderIcon={() => <Undo size={16} className={actionIconStyle} />} />
						<Button
							kind='ghost'
							hasIconOnly
							tooltipPosition='bottom'
							iconDescription='Redo'
							disabled={!canRedo()}
							onClick={() => redoAction()}
							renderIcon={() => <Redo size={16} className={actionIconStyle} />} />
						<div className={toolBarSeparator} />
						<Button
							kind='ghost'
							hasIconOnly
							tooltipPosition='bottom'
							iconDescription='Duplicate fragment'
							onClick={() => showFragmentDuplicateModal(fragment)}
							renderIcon={() => <Copy size={16} className={actionIconStyle} />} />
						<Button
							kind='ghost'
							hasIconOnly
							tooltipPosition='bottom'
							iconDescription='Delete fragment'
							onClick={() => showFragmentDeleteModal(fragment.id)}
							renderIcon={() => <TrashCan size={16} className={actionIconStyle} />} />
						<Button
							kind='primary'
							iconDescription='Export fragment'
							aria-label='Export fragment'
							title='Export fragment'
							renderIcon={DocumentExport}
							onClick={() => showFragmentExportModal(fragment)}>
							Export
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
};
