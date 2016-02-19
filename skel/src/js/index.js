import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import mvi from './mvi';

import 'bulma';

run(({ DOM }) => ({
	DOM: mvi(DOM).skip(1)
}), {
	DOM: makeDOMDriver('#root')
});
