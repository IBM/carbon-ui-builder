import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { App } from './app';
import * as serviceWorker from './serviceWorker';

const render = (Component: any) => {
	const container = document.getElementById('root') as HTMLElement;
	const root = createRoot(container);
	root.render(
		<Component />
	);
};

render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
	module.hot.accept('./app', () => {
		console.info('App updated');
		const Next = require('./app').App;
		render(Next);
	});
}
