import * as button from "./a-button";
import * as checkbox from "./a-checkbox";
import * as column from "./a-column";
import * as grid from "./a-grid";
import * as row from "./a-row";
import * as text from "./a-text";
import * as textarea from "./a-textarea";
import * as textinput from "./a-textinput";
import * as searchinput from "./a-searchinput";
import * as numberinput from "./a-numberinput";
// Tiles
import * as tile from './tiles/a-tile';
import * as clickabletile from './tiles/a-clickabletile';
import * as expandabletile from './tiles/a-expandabletile';
import * as tilefold from './tiles/a-tileFold';

export { AButton, AButtonStyleUI } from "./a-button";
export { ACheckbox, ACheckboxStyleUI, ACheckboxCodeUI } from "./a-checkbox";
export { AColumn, AColumnStyleUI } from "./a-column";
export * from "./a-component";
export { AGrid, AGridStyleUI } from "./a-grid";
export { ARow, ARowStyleUI } from "./a-row";
export { AText, ATextStyleUI } from "./a-text";
export { ATextArea, ATextAreaStyleUI, ATextAreaCodeUI } from "./a-textarea";
export { ATextInput, ATextInputStyleUI, ATextInputCodeUI } from "./a-textinput";
export { ASearchInput, ASearchInputStyleUI, ASearchInputCodeUI } from "./a-searchinput";
export { ANumberInput, ANumberInputStyleUI, ANumberInputCodeUI } from "./a-numberinput";
// Tiles
export { ATile, ATileCodeUI, ATileStyleUI } from './tiles/a-tile';
export { AClickableTile, AClickableTileCodeUI, AClickableTileStyleUI } from './tiles/a-clickabletile';
export { AExpandableTile, AExpandableTileCodeUI, AExpandableStyleUI } from './tiles/a-expandabletile';
export { ATileFold, ATileFoldStyleUI } from './tiles/a-tileFold';

export const allComponents = {
	button,
	checkbox,
	column,
	grid,
	row,
	text,
	textarea,
	textinput,
	searchinput,
	numberinput,
	// Tiles
	tile,
	clickabletile,
	expandabletile,
	tilefold
};
