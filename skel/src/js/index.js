import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { restart, restartable } from 'cycle-restart';

let main = require('./main').default;

const drivers = {
	DOM: restartable(makeDOMDriver('#root'), { pauseSinksWhileReplaying: false })
};

const cycle = run(main, drivers);

if (module.hot) {
	module.hot.accept('./main', () => {
		main = require('./main').default;
		restart(main, drivers, cycle);
	});
}
