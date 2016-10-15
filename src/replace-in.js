import {
	readdirSync as ls,
	renameSync as mv,
	statSync as stat,
	readFileSync as read,
	writeFileSync as write
} from 'fs-extra'
import path from 'path'

// replace all instances of `find` in `dir` with `replace`
const replace_in = (dir, find, replace) => {
	ls(dir).forEach(child => {
		const old_name = path.join(dir, child)
		const name = old_name.replace(find, replace)
		mv(old_name, name)
		if (stat(name).isDirectory()) {
			replace_in(name, find, replace)
		}
		else {
			write(name, read(name, 'utf8').replace(find, replace))
		}
	})
}

export default replace_in
