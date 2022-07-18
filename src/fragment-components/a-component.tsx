import { css, cx } from 'emotion';
import React, { useRef, useState } from 'react';

import { Draggable32, TrashCan32 } from '@carbon/icons-react';
import { drag, getDropIndex } from '../routes/edit/tools';
import { useFragment } from '../context';
import { updatedState } from '../components';

export const componentHeaderZIndex = 999;

const headerStyle = css`
	position: absolute;
	margin-top: -26px;
	padding-left: 6px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
	z-index: ${componentHeaderZIndex};
`;

const iconStyle = css`height: 1rem; width: 1rem; float: right`;

export const AComponentCodeUI = ({ selectedComponent }: any) => {
	return <span className={css`overflow-wrap: anywhere`}>
		{JSON.stringify(selectedComponent)}
	</span>;
};

const dropIndicatorStyle = css`
	background: #0001;
`;

export interface ComponentInfo {
	type: string;
	component: any;
	keywords: string[];
	name: string;
	defaultComponentObj: any;
	image: any; // whatever fits in the <img src="here">
	settingsUI: any;
	codeUI?: any;
	render?: (props: ComponentInfoRenderProps) => any;
	hideFromElementsPane?: boolean;
	codeExport: {
		angular: {
			inputs: (props: { json: any }) => string;
			outputs: (props: { json: any }) => string;
			imports: string[];
			isNotDirectExport?: boolean;
			code: (props: {json: any; jsonToTemplate: (json: any, fragments: any[]) => string; fragments: any[]}) => string;
		};
		react: {
			imports: ((props: {json: any}) => string[]) | string[];
			otherImports?: (props: {json: any; fragments?: any[]}) => string;
			isNotDirectExport?: boolean;
			code: (props: {json: any; jsonToTemplate: (json: any, fragments: any[]) => string; fragments: any[]}) => string;
			additionalCode?: (componentObj: any) => any;
		};
	};
}

export interface ComponentInfoRenderProps {
	componentObj: any;
	select: () => void;
	remove: () => void;
	selected: boolean;
	onDragOver: (event: any) => void;
	onDrop: (event: any) => any;
	outline: boolean | null;
	renderComponents: (componentObj: any, outline: boolean | null) => any;
}

export const AComponent = ({
	children,
	componentObj,
	rejectDrop,
	select,
	selected,
	remove,
	headingCss,
	handleDrop,
	className
}: any) => {
	// TODO use fragments context instead of passing in `remove`?
	const [fragment, setFragment] = useFragment();
	const [showDragOverIndicator, setShowDragOverIndicator] = useState(false);
	const holderRef = useRef(null as any);

	const shouldRejectDrop = (event: any) => {
		if (!rejectDrop) {
			return false;
		}

		if (typeof rejectDrop === 'boolean' && rejectDrop) {
			return true;
		}

		if (typeof rejectDrop === 'function') {
			const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));
			return rejectDrop(dragObj);
		}

		return !!rejectDrop;
	};

	const onDrop = (event: any) => {
		if (shouldRejectDrop(event)) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		setShowDragOverIndicator(false);

		if (handleDrop) {
			handleDrop(event);
			return;
		}

		const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				dragObj,
				componentObj.id,
				getDropIndex(event, holderRef.current)
			)
		});
	};

	return (
		<span
		className={cx(className, showDragOverIndicator ? dropIndicatorStyle : '')}
		ref={holderRef}
		onClick={(event) => {
			event.stopPropagation();
			select();
		}}
		draggable='true' // TODO make Draggable32 the drag handle and this element as preview
		onDragStart={(event: any) => drag(event, {
			component: componentObj,
			type: 'move'
		})}
		onDragEnter={(event: any) => {
			if (shouldRejectDrop(event)) {
				return true;
			}
			event.stopPropagation();
			event.preventDefault();
			setShowDragOverIndicator(true);
		}}
		onDragLeave={(event: any) => {
			if (shouldRejectDrop(event)) {
				return true;
			}
			event.stopPropagation();
			event.preventDefault();
			setShowDragOverIndicator(false);
		}}
		onDragOver={(event) => {
			if (shouldRejectDrop(event)) {
				return true;
			}
			event.stopPropagation();
			event.preventDefault();
		}}
		onDrop={onDrop}>
			<span className={cx(headerStyle, headingCss, selected ? css`` : css`display: none`)}>
				<span className={css`margin-right: 1rem`}>
					{componentObj && componentObj.type ? componentObj.type : 'Header'}
				</span>
				<Draggable32 className={iconStyle} />
				<TrashCan32 onClick={(event: any) => {
					event.stopPropagation();
					if (remove) {
						remove();
					}
				}} className={iconStyle} />
			</span>
			{children}
		</span>
	);
};
