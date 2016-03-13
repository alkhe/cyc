/* global CLIENT */
import { run } from '@cycle/core';
import { makeDOMDriver, makeHTMLDriver } from '@cycle/dom';
import { restart, restartable } from 'cycle-restart';

export let source = './aboutmain';
export let drivers = {};

if (CLIENT) {
	drivers = {
		DOM: restartable(makeDOMDriver('#root'), { pauseSinksWhileReplaying: false })
	};

	let cycle = run(require('./aboutmain').default, drivers);

	if (module.hot) {
		module.hot.accept('./aboutmain', () => {
			cycle = restart(require('./aboutmain').default, drivers, cycle);
		});
	}
}
else {
	drivers = {
		DOM: makeHTMLDriver()
	};
}
