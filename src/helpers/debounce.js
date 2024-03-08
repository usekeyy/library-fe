export const debounce = (callback, delay) => {
	let timer;
	const timeout = (delay) ? delay : 1000;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => callback(...args), timeout);
	};
};