import React, {
	Component,
	ComponentPropsWithRef,
	forwardRef
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { HeaderMenuItem } from 'carbon-components-react/lib/components/UIShell';

interface HeaderMenuItemLinkInterface extends RouteComponentProps, ComponentPropsWithRef<any> { }

class HeaderMenuItemLinkBase extends Component<HeaderMenuItemLinkInterface> {
	render() {
		const {
			history,
			to,
			...rest
		} = this.props as any;
		return (
			<HeaderMenuItem
				onClick={() => history.push(to)}
				onKeyDown={(event: any) => {
					if (event.key === 'Enter') {
						history.push(to);
					}
				}}
				{...rest} />
		);
	}
}

export const HeaderMenuItemLinkRouter = withRouter(HeaderMenuItemLinkBase);

export const HeaderMenuItemLink = forwardRef<HTMLElement, HeaderMenuItemLinkInterface>(
	(props) => <HeaderMenuItemLinkRouter {...props} />
);

// explicitly set display name
HeaderMenuItemLink.displayName = 'HeaderMenuItemLink';
