import React from 'react';
import { TileGroup, RadioTile } from '@carbon/react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';

export interface RadioTileGroupState {
	type: string;
	id: string | number;
	legend?: string;
	disabled?: boolean;
	valueSelected?: string | number;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
}

export interface RadioTileState {
	type: string;
	id?: string | number;
	light?: boolean;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext: {
		name?: string;
		value: string;
	};
}

export const UIRadioTileGroup = ({ state, setState, setGlobalState }: {
	state: RadioTileGroupState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
}) => {
	if (state.type !== 'radio-tile-group') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <TileGroup
	legend={state.legend}
	name={state.codeContext?.name}
	disabled={state.disabled}
	valueSelected={state.valueSelected}
	onChange={(radio: string | number) => setState({ ...state, valueSelected: radio })}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((radioTile: any) => {
				// NOTE: Carbon requires RadioTile to be a direct child so we can't use UIRadioTile here...
				const setRadioTile = (i: any) => setItemInState(i, radioTile, setState);
				return <RadioTile
					key={radioTile.id}
					light={radioTile.light}
					id={radioTile.id}
					name={radioTile.codeContext.name}
					value={radioTile.codeContext.value}
					className={radioTile.cssClasses?.map((cc: any) => cc.id).join(' ')}>
						{
							radioTile.items?.map((item: any) => {
								const setItem = (i: any) => setItemInState(i, item, setRadioTile);
								return renderComponents(item, setItem, setGlobalState);
							})
						}
				</RadioTile>;
			})
		}
	</TileGroup>;
};
