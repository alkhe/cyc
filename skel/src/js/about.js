import { run } from '@cycle/core';
import { makeDOMDriver, makeHTMLDriver } from '@cycle/dom';
import { restartable } from 'cycle-restart';

let main = require('./aboutmain').default;

export default () =>
	run(main, {
		DOM: makeHTMLDriver()
	});

if (CLIENT) {
	let drivers = {
		DOM: restartable(makeDOMDriver('#root'), { pauseSinksWhileReplaying: false })
	};

	Restart('./aboutmain');
}
