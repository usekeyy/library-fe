export const formatNumber = (n, c, d, t) => {
	var cc = isNaN(c = Math.abs(c)) ? 0 : c,
		dd = d === undefined ? "," : d,
		tt = t === undefined ? "." : t,
		s = n < 0 ? "-" : "",
		i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
		j = i.length
    j = (j > 3) ? j % 3 : 0;

	return s + (j ? i.substr(0, j) + tt : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + tt) + (cc ? dd + Math.abs(n - i).toFixed(cc).slice(2) : "");
}

export const padLeadingZeros = (num, size) => {
    var s = "";
    while (s.length < size) s = s + "0";
	s = num + s
    return s;
}

export const formatNumber2 = (n, c, d, t) => {
	n = String(n).replace(",", ".")
	var cc = isNaN(c = Math.abs(c)) ? 0 : c,
		// dd = d === undefined ? "," : d,
		tt = t === undefined ? "." : t,
		s = n < 0 ? "-" : "",
		i_coma = String(
			n.includes(".") ?
			(
				n.substr(n.indexOf('.')).length > cc+1 ?
					n.substr(n.indexOf('.'), cc+1) :
					(n.substr(n.indexOf('.')+1) === undefined || n.substr(n.indexOf('.')+1) === '' ?
						padLeadingZeros('.', cc) : n.substr(n.indexOf('.'))
					)
			) : padLeadingZeros('.', cc)
		).replace(".", ","),
		i_int = String(parseInt(n = Math.abs(Number(n) || 0))),
		// i_coma = i_coma.length-1 < c ? padLeadingZeros(i_coma, c - (i_coma.length - 1)) : i_coma,
		// j = (j = i_int.length) > 3 ? j % 3 : 0,
		j = i_int.length
    j = (j > 3) ? j % 3 : 0;
		var k = j ? i_int.substr(0, j) + tt : "";

	return s + k + i_int.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + tt) + i_coma;
}

export const replaceAll = (string, search, replace) => {
	return string.split(search).join(replace);
}

export const replaceNumberFormat = (data) => {
	let value = data.toString();
	// const convertValue = (value !== undefined)
	// ? value.toString().indexOf('.') !== -1
	// 		? (value.toString().indexOf(',') !== -1) ? parseFloat(value.split('.').join('').replace(/,/g, '.')) : parseFloat(value.split('.').join(''))
	// 		: (value.toString().indexOf(',') !== -1) ? parseFloat(value.replace(/,/g, '.')) : parseFloat(value)
	// : 0;
	value = (value !== undefined)
	? value.toString().indexOf('.') !== -1
			? value.replace(/\./g, '') : value
	: 0;
	value = value.toString().indexOf(',') !== -1 ? parseFloat(value.replace(/,/g, '.')) : parseFloat(value);
	const convertValue = value;
	return Number.isNaN(convertValue) ? 0 : convertValue;
}

export const calculateFormatCurrency = (value, old_value, caret, decimal_length) => {
	old_value = String(old_value)
	let new_value = value
	if (value === '0,') {
		caret += 1
	}
	if (!value.includes(',')) {
		if (value === '') {
			new_value = formatNumber2('0', decimal_length)
			caret = 0
		}
		// if (value.length === old_value.length - 1) {
		// 	new_value = formatNumber2(old_value, decimal_length)
		// 	// caret += 1
		// }
		else {
			new_value = formatNumber2(replaceAll(replaceAll(new_value, '.', ''), ',', '.'), decimal_length)
		}
	}
	else {
		if (parseInt(old_value) === 0) {
			if (value[0] === '0') {
				if (caret > 0 && caret < 3) {
					if (value !=='0,0') {
						caret-=1
					}
				}
			}
			else {
				old_value = old_value.substring(1)
				old_value = value[0] + old_value
				new_value = formatNumber2(old_value, decimal_length)
			}
		}
		else {
			new_value = formatNumber2(replaceAll(replaceAll(new_value, '.', ''), ',', '.'), decimal_length)
			if (value[0] === '.') {
				caret += 1
			}
			let amount_temp = formatNumber2(old_value, decimal_length)
	
			if (new_value.length > amount_temp.length) {
				if (new_value.split(".").length > amount_temp.split(".").length)
				{
					caret += 1
				}
			}
			if (new_value.split(".").length < amount_temp.split(".").length)
			{
				if (caret > 0) {
					caret -= 1
				}
			}
			if (new_value.length === amount_temp.length && amount_temp === formatNumber2(0, decimal_length))
			{
				if (caret > 0) {
					caret -= 1
				}
			}
		}
	}
	return {caret: caret, new_value: new_value}
}



export const xxxxxxxxx = (n, c, d, t) => {
	var cc = isNaN(c = Math.abs(c)) ? 0 : c,
		dd = d === undefined ? "," : d,
		tt = t === undefined ? "." : t,
		s = n < 0 ? "-" : "",
		i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
		j = i.length
    j = (j > 3) ? j % 3 : 0;

	return s + (j ? i.substr(0, j) + tt : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + tt) + (cc ? dd + Math.abs(n - i).toFixed(cc).slice(2) : "");
}