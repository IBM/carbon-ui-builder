import React from 'react';
import { Button } from 'carbon-components-react';
import { withRouter } from 'react-router-dom';

export const LinkButton = withRouter((props: any) => {
	const {
		history,
		to,
		staticContext,
		...rest
	} = props;
	return <Button onClick={() => history.push(to)} {...rest} />;
});
