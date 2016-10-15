import $ from 'xstream'
import { div, br, i, button, h2, h4, makeDOMDriver } from '@cycle/dom'
import { Button, Listen } from './helpers'

export function main({ DOM }) {
	Listen(
		Button(DOM.select('.Home')),
		() => window.location.href = '/'
	)
	Listen(
		Button(DOM.select('.Github')),
		() => window.location.href = 'https://github.com/edge/cyc'
	)
	return {
		DOM: $.of(
			div('.p2.measure', [
				h2('About'),
				h4([
					i('cyc'), ' is a Cycle.js boilerplate built with convenience and speed in mind.'
				]),
				br(),
				button('.btn.Home', 'Home'), ' ',
				button('.btn.Github', 'Github'),
			])
		)
	}
}

export const drivers = {
	DOM: CLIENT ? makeDOMDriver('#root') : () => {}
}
