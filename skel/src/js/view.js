import { Observable as $ } from 'rx';
import { h } from '@cycle/dom';

export default ({ height, weight }) =>
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
