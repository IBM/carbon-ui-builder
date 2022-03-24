// Accordion
import * as accordion from './accordion/a-accordion';
import * as accordionitem from './accordion/a-accordion-item';
import * as button from './a-button';
import * as checkbox from './a-checkbox';
import * as column from './a-column';
import * as fragment from './a-fragment';
import * as grid from './a-grid';
import * as numberinput from './a-numberinput';
import * as row from './a-row';
import * as tag from "./a-tag"
import * as searchinput from './a-searchinput';
import * as text from './a-text';
import * as textarea from './a-textarea';
import * as textinput from './a-textinput';
import * as link from './a-link';

// Accordion
export { AAccordion, AAccordionStyleUI } from './accordion/a-accordion';
export { AAccordionItem, AAccordionItemStyleUI } from './accordion/a-accordion-item';
export { AButton, AButtonStyleUI } from './a-button';
export { ACheckbox, ACheckboxStyleUI, ACheckboxCodeUI } from './a-checkbox';
export { AColumn, AColumnStyleUI } from './a-column';
export * from './a-component';
export { AFragment, AFragmentStyleUI, AFragmentCodeUI } from './a-fragment';
export { AGrid, AGridStyleUI } from './a-grid';
export { ARow, ARowStyleUI } from './a-row';
export { ATag, ATagStyleUI } from './a-tag';
export { AText, ATextStyleUI } from './a-text';
export { ATextArea, ATextAreaStyleUI, ATextAreaCodeUI } from './a-textarea';
export { ATextInput, ATextInputStyleUI, ATextInputCodeUI } from './a-textinput';
export { ASearchInput, ASearchInputStyleUI, ASearchInputCodeUI } from './a-searchinput';
export { ANumberInput, ANumberInputStyleUI, ANumberInputCodeUI } from './a-numberinput';
export { ALink, ALinkStyleUI, ALinkCodeUI } from './a-link';

export const allComponents = {
	accordion,
	accordionitem,
	button,
	checkbox,
	column,
	fragment,
	grid,
	row,
	tag,
	text,
	textarea,
	textinput,
	searchinput,
	numberinput,
	link
};
