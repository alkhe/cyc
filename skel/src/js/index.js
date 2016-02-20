import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
// import isolate from '@cycle/isolate';
import { restart, restartable as R } from 'cycle-restart';

let mvi = require('./mvi').default;

const main = ({ DOM }) => ({
	DOM: mvi(DOM).skip(1)
});

const drivers = {
	DOM: R(makeDOMDriver('#root'), {pauseSinksWhileReplaying: false})
};

const cycle = run(main, drivers);

if (module.hot) {
	module.hot.accept('./mvi', () => {
		mvi = require('./mvi').default;
		restart(main, drivers, cycle);
	});
}
