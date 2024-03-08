export const statusColorAuction = (type) => {
	var data;
	switch(type) {
		case 'y': data = "green"; break;
		case 'n': data = "white"; break;
		case 'r': data = "orange"; break;
		case 'b': data = "red"; break;
		default: return data;
	}
	return data;
}