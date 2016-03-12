/* global CLIENT */
import { run } from '@cycle/core';
import { makeDOMDriver, makeHTMLDriver } from '@cycle/dom';
import { restart, restartable } from 'cycle-restart';

let source = './main', drivers;

if (CLIENT) {
	drivers = {
		DOM: restartable(makeDOMDriver('#root'), { pauseSinksWhileReplaying: false })
	};

	let main = require('./main').default;
	let cycle = run(main, drivers);

	if (module.hot) {
		module.hot.accept('./main', () => {
			main = require('./main').default;
			restart(main, drivers, cycle);
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

export {
	drivers,
	source
}
