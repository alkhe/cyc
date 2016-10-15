import $ from 'xstream'
import { makeDOMDriver } from '@cycle/dom'
import { html } from 'snabbdom-jsx'
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
			<div className='p2 measure'>
				<h2>About</h2>
				<h4>
					<b>cyc</b> is a <b>Cycle.js</b> boilerplate built with <i>convenience</i> and <i>performance</i> in mind.
				</h4>
				<br />
				<button className='btn Home'>Home</button>
				<button className='btn Github'>Github</button>
			</div>
		)
	}
}

export const drivers = {
	DOM: CLIENT ? makeDOMDriver('#root') : () => {}
}
