import { writeFileSync as write } from 'fs'

export let run = compiler => {
	compiler.plugin('done', stats => {
		write('done.json', JSON.stringify(stats.toJson(), null, '\t'))
	})
}

