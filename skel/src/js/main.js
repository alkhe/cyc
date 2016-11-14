import $ from 'xstream'
import { makeDOMDriver } from '@cycle/dom'
import { html } from 'snabbdom-jsx'
import { Input } from './helpers'

const bmi = (height, weight) =>
	weight / (height / 100) ** 2

const elvis = d => (x = d) => x

const logger = {
	next: ::console.log,
	error: ::console.warn,
	complete: ::console.log
}

export function main({ DOM, onion }) {
	let height$ = Input(DOM.select('#Height')).map(x => () => Number(x)).startWith(elvis(177))
	let weight$ = Input(DOM.select('#Weight')).map(x => () => Number(x)).startWith(elvis(62))

	let cmb$ = $
		.combine(height$, weight$)
		.map(([hx, wx]) => s => do {
			let h = hx(s && s[0]);
			let w = wx(s && s[1]);
			[h, w, bmi(h, w).toFixed(1)]
		})

	return {
		DOM: onion.state$
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
			),
		onion: cmb$
	}
}

export const drivers = {
	DOM: CLIENT ? makeDOMDriver('#root') : () => {}
}
