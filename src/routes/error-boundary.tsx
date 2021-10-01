import React, { ErrorInfo } from 'react';
import { NotFound } from './not-found';

/* Currently, there lacks react hooks with equivalent
effect of getDerivedStateFromError and componentDidCatch,
current component based on: https://gist.github.com/andywer/800f3f25ce3698e8f8b5f1e79fed5c9c,
this should be written once the above hooks mentioned above are released.
*/

type ErrorHandler = (error: Error, info: ErrorInfo) => void
type ErrorHandlingComponent<Props> = (props: Props, error?: Error) => React.ReactNode

type ErrorState = { error?: Error }

function Catch<Props extends {}>(
	component: ErrorHandlingComponent<Props>,
	errorHandler?: ErrorHandler
): React.ComponentType<Props> {
	return class Boundary extends React.Component<Props, ErrorState> {
		state: ErrorState = { error: undefined }

		static getDerivedStateFromError(error: Error) {
			return { error };
		}

		componentDidCatch(error: Error, info: React.ErrorInfo) {
			if (errorHandler) {
				errorHandler(error, info);
			}
		}

		render() {
			return component(this.props, this.state.error);
		}
	};
}

type Props = {
	children: React.ReactNode
}

export const ErrorBoundary = Catch((props: Props, error?: Error) => {
	if (error) {
		return <NotFound />;
	}
	return <>{props.children}</>;
});
