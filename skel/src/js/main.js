import $ from 'xstream'
import { div, br, label, input, makeDOMDriver } from '@cycle/dom'
import { Input } from './helpers'

export function main({ DOM }) {
	let height$ = Input(DOM.select('#Height'))
		.startWith('177')
	let weight$ = Input(DOM.select('#Weight'))
		.startWith('62')

	let bmi$ = $
		.combine(height$, weight$)
		.map(([h, w]) => (w / (h / 100) ** 2).toFixed(1))

	return {
		DOM: $.combine(height$, weight$, bmi$)
		.map(([h, w, bmi]) =>
			div('.p2.measure', [
				label({ htmlFor: 'Height' }, 'Height: '),
				input('#Height', { attrs: { value: h } }),
				br(),
				label({ htmlFor: 'Weight' }, 'Weight: '),
				input('#Weight', { attrs: { value: w } }),
				br(),
				'BMI: ' + bmi
			])
		)
	}
}

export const drivers = {
	DOM: CLIENT ? makeDOMDriver('#root') : () => {}
}
