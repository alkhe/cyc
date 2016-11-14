/* global CLIENT */
import Cycle from '@cycle/xstream-run'
import onion from 'cycle-onionify'

export let { main, drivers } = require('./main')

export let start = Restarter(Cycle)

if (CLIENT) start(onion(main), drivers)

if (module.hot) {
	require('webpack-hot-middleware/client')
	module.hot.accept(() => {
		let { main, drivers } = require('./main')
		start(onion(main), drivers)
	})
}
