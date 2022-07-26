import React from 'react';
import { UIAccordion } from './components/ui-accordion';
import { UIAccordionItem } from './components/ui-accordion-item';
import { UIBreadcrumb } from './components/ui-breadcrumb';
import { UIBreadcrumbItem } from './components/ui-breadcrumb-item';
import { UIButton } from './components/ui-button';
import { UICheckbox } from './components/ui-checkbox';
import { UICodeSnippet } from './components/ui-code-snippet';
import { UIColumn } from './components/ui-column';
import { UIComboBox } from './components/ui-combobox';
import { UIDropdown } from './components/ui-dropdown';
import { UIGrid } from './components/ui-grid';
import { UILink } from './components/ui-link';
import { UIList } from './components/ui-list';
import { UIListItem } from './components/ui-list-item';
import { UILoading } from './components/ui-loading';
import { UINumberInput } from './components/ui-number-input';
import { UIProgressIndicator } from './components/ui-progress-indicator';
import { UIRadio } from './components/ui-radio';
import { UIRadioGroup } from './components/ui-radio-group';
import { UIRow } from './components/ui-row';
import { UIText } from './components/ui-text';

export const setItemInState = (item: any, state: any, setState: (state: any) => void) => {
	const itemIndex = state.items.findIndex((i: any) => i.id === item.id);

	setState({
		...state,
		items: [
			...state.items.slice(0, itemIndex),
			item,
			...state.items.slice(itemIndex + 1)
		]
	});
};

export const renderComponents = (state: any, setState: (state: any) => void, setGlobalState: (state: any) => void) => {
	switch (state.type) {
		case 'accordion':
			return <UIAccordion key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'accordion-item':
			return <UIAccordionItem key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'button':
			return <UIButton key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'breadcrumb':
			return <UIBreadcrumb key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'breadcrumb-item':
			return <UIBreadcrumbItem key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'checkbox':
			return <UICheckbox key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'code-snippet':
			return <UICodeSnippet key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'column':
			return <UIColumn key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'combobox':
			return <UIComboBox key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'dropdown':
			return <UIDropdown key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'grid':
			return <UIGrid key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'loading':
			return <UILoading key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'radio-group':
			return <UIRadioGroup key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'radio':
			return <UIRadio key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'row':
			return <UIRow key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'link':
			return <UILink key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'list':
			return <UIList key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'listItem':
			return <UIListItem key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;
		case 'number-input':
			return <UINumberInput key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'progress-indicator':
			return <UIProgressIndicator key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		case 'text':
			return <UIText key={state.id} state={state} setState={setState} setGlobalState={setGlobalState} />;

		default:
			break;
	}

	if (state.items && Array.isArray(state.items)) {
		// setItem is a setState for that particular item
		const setItem = (item: any) => setItemInState(item, state, setState);

		return state.items.map((item: any) => renderComponents(item, setItem, setState));
	}
};
