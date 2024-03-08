export const toFloat = async (value) => {
	let floatPrice = value;
	try {
		if(value.toString().indexOf(',') !== -1 && value.toString().indexOf('.') !== -1){
			const split1 = value.toString().split('.').join(';');
			const split2 = split1.toString().split(',').join('.');
			floatPrice = parseFloat(split2.toString().split(';').join(''));
		} else if(value.toString().indexOf(',') !== -1){
			const split3 = value.toString().split(',').join('.');
			floatPrice = parseFloat(split3);
		} else if(value.toString().indexOf('.') !== -1){
			floatPrice = parseFloat(value.toString().split('.').join(''));
		} else {
			floatPrice = parseFloat(value)
		}
	} catch (err){
		floatPrice = 0;
	}
	return floatPrice;
}