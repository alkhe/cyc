// DOM event helpers
const Event = (ev, mod = x => x) =>
	el => mod(el.events(ev))

// Input(DOM.select('.some-input'))
const Input = Event('input', x => x.map(e => e.target.value))
// Button(DOM.select('.some-button'))
const Button = Event('click')

const Listen = (stream, listener) => stream.addListener({
	next: listener,
	error() {},
	complete() {}
})

export {
	Event,
	Input,
	Button,
	Listen
}
