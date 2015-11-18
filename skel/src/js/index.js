import Cycle from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import view from './view';

Cycle.run(({ DOM }) => ({ DOM: view(DOM).skip(1) }), {
	DOM: makeDOMDriver('#root')
});
