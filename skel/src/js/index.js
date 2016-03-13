/* global CLIENT */
import { run } from '@cycle/core';
import { makeDOMDriver, makeHTMLDriver } from '@cycle/dom';
import { rerunner, restartable } from 'cycle-restart';

export let source = './main';
export let drivers = {};

if (CLIENT) {
	drivers = {
		DOM: restartable(makeDOMDriver('#root'), { pauseSinksWhileReplaying: false })
	};

	let rerun = rerunner(run);
	rerun(require('./main').default, drivers);

	if (module.hot) {
		module.hot.accept('./main', () => {
			rerun(require('./main').default, drivers);
		});
	}
}
else {
	drivers = {
		DOM: makeHTMLDriver()
	};
}
