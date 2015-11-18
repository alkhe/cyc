import { Observable as $ } from 'rx';
import { h } from '@cycle/dom';

export default () => $.interval(100)
	.startWith(0)
.map(x => h('div', '' + x));
