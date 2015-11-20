import Cycle from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import view from './view';
import model from './model';
import intent from './intent';

Cycle.run(({ DOM }) => ({
	DOM: view(model(intent(DOM))).skip(1)
}), {
	DOM: makeDOMDriver('#root')
});
