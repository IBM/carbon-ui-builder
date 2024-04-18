import React from 'react';
import { MarginPaddingWidget } from './margin-padding-widget';

export const LayoutWidget = ({ component, setComponent }: any) => {
	return <div>
		<MarginPaddingWidget component={component} setComponent={setComponent} />
	</div>;
};
