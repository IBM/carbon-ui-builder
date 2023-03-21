import React from 'react';
import { TileGroup, RadioTile } from 'carbon-components-react';
import { CssClasses } from '../types';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';

export interface RadioTileGroupState {
	type: string;
	id: string | number;
	legend?: string;
	disabled?: string | boolean;
	valueSelected?: string | number;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
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
	style?: any;
}

export const UIRadioTileGroup = ({ state, setState, setGlobalState, sendSignal }: {
	state: RadioTileGroupState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'radio-tile-group') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	let cssClasses = state.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (state.style) {
		if (cssClasses.length > 0) {
			cssClasses += ' ';
		}
		cssClasses += stringToCssClassName(state.codeContext.name);
	}

	return <TileGroup
	legend={state.legend}
	name={state.codeContext?.name}
	disabled={state.disabled}
	valueSelected={state.valueSelected}
	onChange={(radio: string | number) => setState({ ...state, valueSelected: radio })}
	className={cssClasses}>
		{
			state.items?.map((radioTile: any) => {
				// NOTE: Carbon requires RadioTile to be a direct child so we can't use UIRadioTile here...
				const setRadioTile = (i: any) => setItemInState(i, radioTile, setState);

				let radioTileCssClasses = radioTile.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

				if (radioTile.style) {
					if (radioTileCssClasses.length > 0) {
						radioTileCssClasses += ' ';
					}
					radioTileCssClasses += stringToCssClassName(radioTile.codeContext.name);
				}

				return <RadioTile
					key={radioTile.id}
					light={radioTile.light}
					id={radioTile.id}
					name={radioTile.codeContext.name}
					value={radioTile.codeContext.value}
					className={radioTileCssClasses}>
						{
							radioTile.items?.map((item: any) => {
								const setItem = (i: any) => setItemInState(i, item, setRadioTile);
								return renderComponents(item, setItem, setGlobalState, sendSignal);
							})
						}
				</RadioTile>;
			})
		}
	</TileGroup>;
};
