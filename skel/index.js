import express from 'express'
import pug from 'pug'
import { babel } from 'dynamic-require'
import morgan from 'morgan'

global.CLIENT = false

global.Restarter = Cycle => {
	let dispose = () => {}
	return (main, drivers) => {
		dispose()
		let { run, ...machine } = Cycle(main, drivers)
		dispose = run()
		return machine
	}
}

// Error.stackTraceLimit = Infinity

// helpers and constants
const here = process.cwd()
const log = ::console.log
const port = process.env.PORT || 3000
const app = express()
	.use(morgan(process.env.NODE_ENV === 'production'
		? '[:date[web]] :remote-addr :method/:http-version :url -- :status :response-time ms'
		: 'dev'
	))
const router = express.Router()

let hashes = {}
let devopt = {}
const dynamicRequire = babel(here)

if (process.env.NODE_ENV === 'production') {
	log('[pro]')
	app.use(require('compression')())
	let { readFileSync } = require('fs')
	hashes = JSON.parse(readFileSync('./hashes.json'))
}
else {
	log('[dev]')
	// use dev compilation and hot reloading
	const config = require('./wp.dev.babel').default,
		compiler = require('webpack')(config),
		dev = require('webpack-dev-middleware'),
		hot = require('webpack-hot-middleware')

	app.use(dev(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	})).use(hot(compiler))
	devopt.hotAccept = require('./hot')
		.make(compiler, dynamicRequire, next => {
			for (let id in next) {
				let entry = next[id]
				hashes[id] = entry instanceof Array ? entry[0] : entry
			}
		})
	//require('./hot2')
	//	.run(compiler)
}

import { makeHTMLDriver } from '@cycle/dom'
import onion from 'cycle-onionify'

// takes a config and creates a server endpoint
let endpoint = ({ app, page, route, id }) => {
	const template = pug.compileFile(page)
	let { main, drivers, start } = dynamicRequire(app)

	if (process.env.NODE_ENV !== 'production') {
		// register program with hot rebuilder
		devopt.hotAccept(app, m => {
			main = m.main
			drivers = m.drivers
			start = m.start
		})
	}

	router.get(route, (req, res) => {
		start(onion(main), {
			...drivers,
			DOM: makeHTMLDriver(
				ssr => res.send(template({ ssr, lib: 'lib/' + hashes[id] }))
			)
		})
	})
}

import routes from './routes'
routes.forEach(endpoint)

app
	.use(router)
	.use(express.static('./public'))

app.listen(port, '::1', err => {
	if (err) {
		return console.err(err)
	}
	log(`listening on http://::1:${ port }`)
})
