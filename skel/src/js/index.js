/* global CLIENT */
import { run } from '@cycle/core';
import { makeDOMDriver, makeHTMLDriver } from '@cycle/dom';
import { restart, restartable } from 'cycle-restart';

export let source = './main';
export let drivers = {};

if (CLIENT) {
	drivers = {
		DOM: restartable(makeDOMDriver('#root'), { pauseSinksWhileReplaying: false })
	};

	let cycle = run(require('./main').default, drivers);

	if (module.hot) {
		module.hot.accept('./main', () => {
			restart(require('./main').default, drivers, cycle);
		});
	}
}
else {
	let { join } = require('path');
	source = require.resolve(join(__dirname, source));
	drivers = {
		DOM: makeHTMLDriver()
	};
}
