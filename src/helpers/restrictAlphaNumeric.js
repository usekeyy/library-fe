export const restrictAlphaNumeric = (event) => {
	const keyCode = event.keyCode || event.which;
	const keyValue = String.fromCharCode(keyCode);
	 if (/[^A-Za-z ]+/.test(keyValue))
		 event.preventDefault();
}