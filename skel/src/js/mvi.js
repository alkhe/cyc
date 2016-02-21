import { Observable as $ } from 'rx';
import { h } from '@cycle/dom';

// DOM event helpers
const Event = (ev, mod = x => x) =>
	el => mod(el.events(ev));

const input = Event('input', x => x.pluck('target', 'value'));

const intent = DOM => ({
	height: input(DOM.select('.Height')),
	weight: input(DOM.select('.Weight'))
});

const model = ({ height, weight }) => ({
	height: height.startWith('177'),
	weight: weight.startWith('62')
});

const view = ({ height, weight }) =>
	$.combineLatest(height, weight,
		(height, weight) =>
			h('.p2.measure', [
				'Height: ', h('input.Height', { value: height }),
				h('br'),
				'Weight: ', h('input.Weight', { value: weight }),
				h('br'),
				'BMI: ' + (weight / (height / 100) ** 2).toFixed(1)
			])
	);

export default DOM => view(model(intent(DOM)));
