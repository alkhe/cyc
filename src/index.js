import { version } from '../package.json'

const log = ::console.log
const exit = () => process.exit(0)

const [,,arg] = process.argv
if (arg === '-v' || arg === '--version') {
	log(version)
	exit()
}

const { cyan, blue, green, magenta, red } = require('colors/safe')

log(cyan(`cyc v${ version }`))

const die = msg => {
	log(red(msg))
	exit()
}

const copy = require('clean-copy').default
const path = require('path')
const prompt = require('prompt')
const replace_in = require('./replace-in').default

const skel = path.resolve(__dirname, '../skel')

prompt.message = ''
prompt.delimiter = ''
prompt.start({ noHandleSIGINT: true })

prompt.get({ name: 'name', description: blue('Application Name'), required: true }, (err, res) => {
	if (err) die(err)
	const { name } = res
	prompt.get({ name: 'dir', description: blue('Directory'), default: name, required: true }, (err, res) => {
		if (err) die(err)
		const dir = path.resolve(res.dir)
		log(green('Copying...'))
		copy(skel, dir, path => !/^node_modules$/.test(path)).then(() => {
			log(green('Populating...'))
			replace_in(dir, /--name--/g, name)
			log(magenta('Done.'))
		}).catch(die)
	})
})
