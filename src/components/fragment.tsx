import React, { useContext, useRef, useState } from 'react';
import { SkeletonPlaceholder } from 'carbon-components-react';
import { Add32, DropPhoto32 } from '@carbon/icons-react';
import './fragment-preview.scss';
import { css, cx } from 'emotion';
import { allComponents, ComponentInfoRenderProps } from '../fragment-components';
import { getFragmentsFromLocalStorage, getRandomId } from '../utils/fragment-tools';
import { GlobalStateContext } from '../context';
import { getAllFragmentStyleClasses } from '../ui-fragment/src/utils';
import { getDropIndex } from '../sdk/src/tools';

const canvas = css`
	border: 2px solid #d8d8d8;
	background-color: white;
	position: relative;

	> div {
		height: 100%;
	}
`;

const centerStyle = css`
	height: 100%;
	display: flex;
	align-items: center;
	color: #8d8d8d;
	cursor: pointer;

	> div {
		margin: auto;

		p {
			display: flex;
			line-height: 32px;

			svg {
				margin-right: 0.5rem;
			}
		}
	}
`;

const allowDrop = (event: any) => {
	event.stopPropagation();
	event.preventDefault();
};

let componentCounter = 2; // actually initialized (again) in Fragment

export const getHighestId = (componentObj: any) => {
	if (!componentObj) {
		return 0;
	}

	if (!componentObj.items || !componentObj.items.length) {
		return +componentObj.id || 0;
	}

	return Math.max(...componentObj.items.map((item: any) => getHighestId(item)), (+componentObj.id || 0));
};

export const getNewId = () => {
	const id = '' + componentCounter++;

	// beyond 20 digits, js goes to scientific notation so we'd get collisions
	if (id.length > 20) {
		return getRandomId();
	}

	return id;
};

export const stateWithoutComponent = (state: any, componentId: number) => {
	if (state.items) {
		const componentIndex = state.items.findIndex((component: any) => component.id === componentId);
		if (componentIndex >= 0) {
			return {
				...state,
				items: [...state.items.slice(0, componentIndex), ...state.items.slice(componentIndex + 1)]
			};
		}

		return {
			...state,
			items: state.items.map((item: any) => stateWithoutComponent(item, componentId))
		};
	}

	return { ...state };
};

export const initializeIds = (componentObj: any, forceNewIds = false) => {
	let id = null;
	if (forceNewIds) {
		id = getNewId();
	}
	id = id || componentObj.id || getNewId();
	// name is used in form items and for angular inputs and outputs variable names
	let name = componentObj.codeContext?.name;
	if (name === undefined || forceNewIds) {
		name = `${componentObj.type}-${id}`;
	}

	return {
		...componentObj,
		id,
		items: componentObj.items ? componentObj.items.map((co: any) => initializeIds(co, forceNewIds)) : undefined,
		codeContext: {
			...componentObj.codeContext,
			name
		}
	};
};

const updatedList = (list: any[], item: any, dropInIndex?: number) => {
	if (dropInIndex === undefined) {
		return [...list, item];
	}

	return [...list.slice(0, dropInIndex), item, ...list.slice(dropInIndex)];
};

export const updatedState = (state: any, dragObj: any, dropInId?: number, dropInIndex?: number) => {
	if (!state) { // NOTE is this needed?
		return;
	}

	// give unique ids to newly dropped components
	dragObj.component = initializeIds(dragObj.component);

	// only update
	if (dragObj.type === 'update') {
		if (state.id && state.id === dragObj.component.id) {
			return {
				...state,
				...dragObj.component
			};
		}
		if (state.items) {
			state.items = state.items.map((item: any) => updatedState(item, dragObj, dropInId, dropInIndex));
		}

		return { ...state };
	}

	if (dragObj.type === 'move') {
		state = stateWithoutComponent(state, dragObj.component.id);
		dragObj.type = 'insert';
	}

	if (state.items) {
		state.items = state.items.map((item: any) => updatedState(item, dragObj, dropInId, dropInIndex));
	}

	if (!dropInId) {
		return state.items && !state.type ? {
			...state,
			items: updatedList(state.items, dragObj.component, dropInIndex)
		} : { ...state };
	}
	/// ////////// TODO NOTE clean the container items with 1 item //////////////
	if (state.id && state.id === dropInId) {
		// add data into state
		if (state.items) {
			return {
				...state,
				items: updatedList(state.items, dragObj.component, dropInIndex),
				id: state.id
			};
		}

		// convert into a list of components, move current component into list
		return {
			// TODO should this be a `type: container`?
			id: getNewId(),
			items: updatedList([{ ...state }], dragObj.component, dropInIndex)
		};
	}

	if (dropInId) { // probably don't wanna add it here since it didn't match anything and it should somewhere
		return { ...state };
	}

	return state.items ? {
		...state,
		items: updatedList(state.items, dragObj.component, dropInIndex)
	} : { ...state };
};

export const getParentComponent = (state: any, child: any) => {
	if (state && state.items) {
		if (state.items.includes(child)) {
			return state;
		}
		for (let i = 0; i < state.items.length; i++) {
			const component = state.items[i];
			const parent: any = getParentComponent(component, child);
			if (parent) {
				return parent;
			}
		}
	}

	return null;
};

export const Fragment = ({ fragment, setFragment, outline }: any) => {
	const globalState = useContext(GlobalStateContext);
	const [showDragOverIndicator, setShowDragOverIndicator] = useState(false);
	const holderRef = useRef(null as any);

	if (!fragment || !fragment.data) {
		return <SkeletonPlaceholder />;
	}

	// try to use the state but get the fragments from local storage if state is not available
	// localStorage info is used when rendering and can't be used for interaction
	const { fragments } = globalState || { fragments: getFragmentsFromLocalStorage() };

	// initialize component counter
	componentCounter = getHighestId(fragment.data) + 1;

	const drop = (event: any) => {
		event.stopPropagation();
		event.preventDefault();
		setShowDragOverIndicator(false);

		const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				dragObj,
				fragment.data.id,
				getDropIndex(event, holderRef.current)
			)
		});
	};

	const select = (componentObj: any) => {
		setFragment({
			...fragment,
			selectedComponentId: componentObj.id
		}, false);
	};

	const remove = (componentObj: any) => {
		setFragment({
			...fragment,
			data: stateWithoutComponent(fragment.data, componentObj.id)
		});
	};

	const addGrid = (event: any) => {
		if (event) {
			event.stopPropagation();
		}

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				{
					type: 'insert',
					component: allComponents.grid.componentInfo.defaultComponentObj
				}, fragment.data.id, 0
			)
		});
	};

	const renderComponents = (componentObj: any, outline: boolean | null = null): any => {
		if (typeof componentObj === 'string' || !componentObj) {
			return componentObj;
		}

		for (const component of Object.values(allComponents)) {
		// TODO fragment should have overwritable properties
		// overwritten properties are in componentObj in the same level as id, but can go deep, they merge
		//     with subFragment before rendering
		// overwriting happens when you select something in the fragment and change its value (a button to reverse to default?)
		//     default value can be set as placeholder in context?
		// also provide a clone/duplicate functionality/button that essentially copies the
		//     componentObj of subFragment in place in our fragment?
		// JSON export should include json of the subFragment
			if (componentObj.type === component.componentInfo.type) {
				if (component.componentInfo.render) {
					return component.componentInfo.render({
						componentObj,
						select: () => select(componentObj),
						remove: () => remove(componentObj),
						selected: fragment.selectedComponentId === componentObj.id,
						renderComponents,
						outline
					} as ComponentInfoRenderProps);
				}
				return <component.componentInfo.component
					key={componentObj.id}
					componentObj={componentObj}
					select={() => select(componentObj)}
					remove={() => remove(componentObj)}
					selected={fragment.selectedComponentId === componentObj.id}
					outline={outline}>
						{componentObj.items && componentObj.items.map((row: any) => renderComponents(row, outline))}
				</component.componentInfo.component>;
			}
		}

		if (componentObj.items) {
			return componentObj.items.map((item: any) => renderComponents(item, outline));
		}

		return null;
	};

	const styles = css`${
		getAllFragmentStyleClasses(fragment, fragments, globalState?.styleClasses).map((styleClass: any) => `.${styleClass.id} {
			${styleClass.content}
		}`)
	}`;
	// TODO add fragment.width and fragment.height to database
	return (
		<div
		className={cx(
			canvas,
			styles,
			css`width: ${fragment.width || '800'}px; height: ${fragment.height || '600'}px`
		)}
		style={{
			background: showDragOverIndicator ? '#0001' : ''
		}}
		onDragEnter={(event: any) => {
			event.stopPropagation();
			event.preventDefault();
			setShowDragOverIndicator(true);
		}}
		onDragLeave={(event: any) => {
			event.stopPropagation();
			event.preventDefault();
			setShowDragOverIndicator(false);
		}}
		onDragOver={allowDrop}
		onDrop={drop}>
			<div ref={holderRef} className={`${fragment.cssClasses ? fragment.cssClasses.map((cc: any) => cc.id).join(' ') : ''}`}>
				{
					!fragment.data?.items?.length && <div className={centerStyle} onClick={addGrid}>
						<div>
							<p><Add32 /> Click to add grid <br /></p>
							<p><DropPhoto32 /> Drag and drop an element from the left pane to get started</p>
						</div>
					</div>
				}
				{renderComponents(fragment.data, outline)}
			</div>
		</div>
	);
};
