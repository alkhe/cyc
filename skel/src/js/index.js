import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { restart, restartable } from 'cycle-restart';
import 'bulma';

let mvi = require('./mvi').default;

const main = ({ DOM }) => ({
	DOM: mvi(DOM)
});

const drivers = {
	DOM: restartable(makeDOMDriver('#root'), { pauseSinksWhileReplaying: false })
};

const cycle = run(main, drivers);

if (module.hot) {
	module.hot.accept('./mvi', () => {
		mvi = require('./mvi').default;
		restart(main, drivers, cycle);
	});
}
