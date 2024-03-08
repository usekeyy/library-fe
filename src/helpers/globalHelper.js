export const groupBy = (xs, key) => {
	return xs.reduce(function(rv, x) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
	}, {});
}

export const siujkGroupByClassification = (a) => {
	var b = [];
	var c = [];

	for(let i in a) {
			if (b.includes(a[i]).number) {
					let ec = {...c[a[i].number].classifications};
					if(a[i].sub_classification !== null) { ec.sub_classification.push(JSON.parse(a[i].sub_classification)); }
					c[a[i].number].classifications = ec;
			} else {
					let classifications = {
							classification_id: a[i].classification_id,
							classification_name: a[i].classification_name,
							sub_classification: (a[i].sub_classification !== null) ? JSON.parse([a[i].sub_classification]) : null
					}
					c[a[i].number] = {...a[i], classifications};
					b.push(a[i].number);
			}
	}
	return Object.values(c);
}

export const clearCacheData = () => {
	// caches.keys().then((names) => {
	// 	names.forEach((name) => {
	// 	caches.delete(name);
	// 	});
	// });

	localStorage.removeItem('access-control')
	localStorage.removeItem('token')
	localStorage.removeItem('i18nextLng')
	localStorage.removeItem('persist:root')
	localStorage.removeItem('times')

	window.location.reload(true)
};

export const checkFileTempVendor = async (e,file) => {
	e.preventDefault()
	let url = `${process.env.REACT_APP_API_BASE_URL}files/vendor/${file}`
	let url2 = `${process.env.REACT_APP_API_BASE_URL}files/temp/${file}`
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	try {
		http.send();
		if (http.status!==404){
			window.open(url)
		}else{
			window.open(url2)
		}
	} catch (error) {
		window.open(url)
	} 
}