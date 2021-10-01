import React, { useState } from 'react';

import {
	Button,
	TextInput,
	Dropdown,
	Checkbox,
	TooltipDefinition,
	StructuredListWrapper,
	StructuredListHead,
	StructuredListRow,
	StructuredListBody,
	StructuredListCell
} from 'carbon-components-react';

import { Delete20, UserFollow20 } from '@carbon/icons-react';
import { css } from 'emotion';
import { useForm, Controller } from 'react-hook-form';

const formItemWrapper = css`
    display: flex;
    align-items: flex-end;

    // The screen width that causes the text in the email input to be cut off. Moves dropdown
    // below the search bar at this point.
    @media screen and (max-width: 450px) {
        flex-wrap: wrap;
        input {
            width: 100%;
            margin-bottom: 10px;
        }
        .bx--dropdown__wrapper {
            width: 100%;
        }
    }
`;

const checkbox = css`
    margin-bottom: 30px;
`;

const permissionDropdown = css`
    margin-left: 40px;

    @media screen and (max-width: 450px) {
        margin-left: 0px;
        width: 100%;
    }
`;

const emailInputWrapper = css`
    width: 100%;
    display: flex;
    align-items: flex-end;

    button {
        background-color: #ffffff;
        border-bottom: 1px solid #8d8d8d;
    }

    @media screen and (max-width: 450px) {
        button {
            margin-bottom: 10px;
        }
    }
`;

const listCell = css`
    vertical-align: middle;
`;

const deleteCell = css`
    vertical-align: middle;
    text-align: center;

    svg:hover {
        cursor: pointer
    }
`;

const structuredList = css`
    margin-top: 30px;
`;

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{1,4}$/i;

export const Permissions = ({ shareOptionsState, setShareOptionsState }: any) => {
	const { handleSubmit, register, errors, control } = useForm();
	// The current permission selected in the permission form before being added to the table.
	// Needs to be done this way in order to be able to change permission to 'owner' if current
	// selected permission in the dropdown is 'read only' and the fragment switches from a non public
	// fragment to a public fragment.
	const [selectedPermission, setSelectedPermission] = useState({ text: 'Owner' });

	const removePermission = (rowIndex: number) => {
		setShareOptionsState({
			...shareOptionsState,
			fragmentPermissions: shareOptionsState.fragmentPermissions
				.filter((_: any, i: number) => i !== rowIndex)
		});
	};

	const changePermission = (rowIndex: number, permission: string) => {
		const newPermissions = [...shareOptionsState.fragmentPermissions];
		newPermissions[rowIndex].permission = permission;
		setShareOptionsState({
			...shareOptionsState,
			fragmentPermissions: newPermissions
		});
	};

	const addPermission = (submit: any) => {
		if (shareOptionsState.fragmentPermissions
			.find((permission: any) => permission.email === submit.email)) {
			return;
		}
		setShareOptionsState({
			...shareOptionsState,
			fragmentPermissions: [
				...shareOptionsState.fragmentPermissions,
				// Necessary to check for `selectedItem` since `control` from `useForm` adds a
				// `selectedItem` if a dropdown selection has been made but initial selected item
				// does not contain the `selectedItem`.
				{
					email: submit.email,
					permission: submit.permission.text
				}
			]
		});
	};

	const permissions = [
		{ text: 'Read only' },
		{ text: 'Owner' }
	];
	return (
		<>
			<Checkbox
				className={checkbox}
				id='permission-checkbox'
				defaultChecked={shareOptionsState.isFragmentPublic}
				labelText={
					<>
						<label className={css`margin-right: 3px; font-size: 0.75rem`}>
							Make this fragment
						</label>
						<TooltipDefinition
							tooltipText=
								'Making a fragment public removes all users with Read only priviledges'>
							public
						</TooltipDefinition>
					</>
				}
				onChange={(event: boolean) => {
					setShareOptionsState({
						...shareOptionsState,
						isFragmentPublic: event
					});
					if (selectedPermission.text === 'Read only') {
						setSelectedPermission({ text: (event ? 'Owner' : 'Read only') });
						// Need to manually set the control value of the controller because we are
						// switching the current selected permission of the dropdown through another
						// component and when the dropdown is inside the controller, the control
						// does not pick up that any changes have been made.
						control.setValue('permission', { text: (event ? 'Owner' : 'Read only') });
					}
				}} />
			<form onSubmit={handleSubmit(addPermission)}>
				<div className={formItemWrapper}>
					<div className={emailInputWrapper}>
						<TextInput
							name='email'
							invalid={!!errors.email}
							ref={register({
								required: 'Required',
								pattern: {
									value: emailRegex,
									message: 'Invalid email address'
								}
							})}
							placeholder='Enter email address'
							id='emailInput'
							labelText='Add new permission' />
						<Button
							kind='ghost'
							className='followButton'
							aria-label='Add permission'
							size='field'
							type='submit'>
							<UserFollow20 />
						</Button>
					</div>
					<div className={permissionDropdown}>
						<Controller
							name='permission'
							control={control}
							defaultValue={selectedPermission}
							// Manually change the selected permission in order to have a default
							// selected permission.
							onChange={(selectedItem: any) => {
								setSelectedPermission(selectedItem[0].selectedItem);
								return selectedItem[0].selectedItem;
							}}
							as={
								<Dropdown
									invalid={false}
									invalidText='Can not add read only permission if fragment is public'
									disabled={shareOptionsState.isFragmentPublic}
									id='permission-dropdown'
									items={permissions}
									itemToString={(item: any) => (item ? item.text : '')}
									selectedItem={selectedPermission}
									ariaLabel='Modify permission' />
							} />
					</div>
				</div>
			</form>
			{
				errors.email
					? <div className={'bx--form-requirement'}>Must enter a valid email</div>
					: null
			}
			<StructuredListWrapper className={structuredList}>
				<StructuredListHead>
					<StructuredListRow head>
						<StructuredListCell head>Permissions</StructuredListCell>
						<StructuredListCell head></StructuredListCell>
						<StructuredListCell head></StructuredListCell>
					</StructuredListRow>
				</StructuredListHead>
				<StructuredListBody>
					{shareOptionsState.fragmentPermissions.map((fragmentPermission: any, rowIndex: number) => {
						if (fragmentPermission.permission === 'Read only' && shareOptionsState.isFragmentPublic) {
							return null;
						}
						return (
							<StructuredListRow key={fragmentPermission.email}>
								<StructuredListCell
									className={listCell}
									tabIndex={0}
									aria-label={`Permissions for ${fragmentPermission.email}`}>
									{fragmentPermission.email}
								</StructuredListCell>
								<StructuredListCell className={listCell}>
									<Dropdown
										invalid={false}
										invalidText='Can not add read only permission if fragment is public'
										id='table-permission-dropdown'
										items={permissions}
										onChange={
											(event: any) =>
												changePermission(rowIndex, event.selectedItem.text)
										}
										itemToString={(item: any) => (item ? item.text : '')}
										initialSelectedItem={{ text: fragmentPermission.permission }}
										label={`Modify permission for ${fragmentPermission.email}`} />
								</StructuredListCell>
								<StructuredListCell className={deleteCell}>
									<Button
										kind='ghost'
										onClick={() => removePermission(rowIndex)}
										aria-label={`Delete permission for ${fragmentPermission.email}`}>
										<Delete20 />
									</Button>
								</StructuredListCell>
							</StructuredListRow>
						);
					})}
				</StructuredListBody>
			</StructuredListWrapper>
		</>
	);
};
