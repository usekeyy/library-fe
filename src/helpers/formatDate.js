export const dateNow = (type) => {
	let monthNames = [
			"Januari",
			"Februari",
			"Maret",
			"April",
			"Mei",
			"Juni",
			"Juli",
			"Agustus",
			"September",
			"Oktober",
			"November",
			"Desember"
	];
	let day = this.getDate();
	let monthIndex = this.getMonth();
	let monthName = monthNames[monthIndex];
	let year = this.getFullYear();
	return `${day}-${monthName}-${year}`;  
}

export const formatDate = (date, isTime, isMiliseconds) => {
	let datex
	var timestamp = Date.parse(date);
	if (isNaN(timestamp) === false) {
		var dt = new Date(timestamp);
		const getTimes = (isTime) ? `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}` : '';
		datex = `${dt.getDate().toString().padStart(2, '0')}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${dt.getFullYear().toString().padStart(4, '0')} ${getTimes}`
		if (isMiliseconds) datex= datex+`.${dt.getMilliseconds().toString().padStart(3, '0')}`
	} else {
		datex = ""
	}
	return datex;
}