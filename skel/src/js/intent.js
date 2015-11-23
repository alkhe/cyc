const input = (DOM, selector) =>
	DOM.select(selector)
		.events('input')
		.map(e => e.target.value);

export default DOM => ({
	height: input(DOM, '.Height'),
	weight: input(DOM, '.Weight')
});
//
// import { Observable as $ } from 'rx';
//
// export default (DOM) => {
// 	console.log(DOM)
// 	console.log(DOM)
// 	console.log(DOM)
// 	return {
// 		height: $.empty(),
// 		weight: $.empty()
// 	}
// }
