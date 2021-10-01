import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from './app';
import * as serviceWorker from './serviceWorker';

// eslint-disable-next-line
const render = (Component: any) => ReactDOM.render(<Component/>, document.getElementById('root'));

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
