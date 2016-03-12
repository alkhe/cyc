import { Observable as $ } from 'rx';
import { div, br, label, input } from '@cycle/dom';

// DOM event helpers
// put them in a seperate file if you wish to reuse them
const Event = (ev, mod = x => x) =>
	el => mod(el.events(ev));

const Input = Event('input', x => x.pluck('target', 'value'));
// const Button = Event('click');

export default ({ DOM }) => {
	let height$ = Input(DOM.select('#Height'))
		.startWith('177'),
		weight$ = Input(DOM.select('#Weight'))
		.startWith('62');

	let bmi$ = $.combineLatest(
		height$, weight$,
		(h, w) => (w / (h / 100) ** 2).toFixed(1)
	);

	return {
		DOM: $.combineLatest(height$, weight$, bmi$, (h, w, bmi) =>
			div('.p2.measure', [
				label({ htmlFor: 'Height' }, 'Height: '),
				input('#Height', { value: h }),
				br(),
				label({ htmlFor: 'Weight' }, 'Weight: '),
				input('#Weight', { value: w }),
				br(),
				'BMI: ' + bmi
			])
		)
	};
}
