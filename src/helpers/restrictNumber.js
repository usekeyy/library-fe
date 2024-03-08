export const restrictNumber = (event) => {
	const keyCode = event.keyCode || event.which;
	const keyValue = String.fromCharCode(keyCode);
	 if (/\+|e|-/.test(keyValue))
		 event.preventDefault();
}
