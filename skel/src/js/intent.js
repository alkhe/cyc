const input = (DOM, selector) =>
	DOM.select(selector)
		.events('input')
		.map(e => e.target.value);

export default DOM => ({
	height: input(DOM, '.Height'),
	weight: input(DOM, '.Weight')
});
