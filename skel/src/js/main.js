import $ from 'xstream'
import { makeDOMDriver } from '@cycle/dom'
import { html } from 'snabbdom-jsx'
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
			<div className='p2 measure'>
				<label htmlFor='height'>Height: </label>
				<input id='Height' value={ h } />
				<br />
				<label htmlFor='weight'>Weight: </label>
				<input id='Weight' value={ w } />
				<br />
				BMI: { bmi }
			</div>
		)
	}
}

export const drivers = {
	DOM: CLIENT ? makeDOMDriver('#root') : () => {}
}
