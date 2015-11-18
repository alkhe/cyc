import { Observable as $ } from 'rx';
import Cycle from '@cycle/core';
import { h, makeDOMDriver } from '@cycle/dom';

Cycle.run(() => ({
	DOM: $.interval(100)
		.startWith(0)
		.map(x => h('div', '' + x))
}), {
	DOM: makeDOMDriver('#root')
});
