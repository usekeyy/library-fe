import axios from 'axios';
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
dotenvExpand(dotenv.config())

export default axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	withCredentials: false,
	crossdomain: true,
	// timeout: 10000,
	// proxy: {
	// 	host: "http://localhost",
	// 	port: 3000
	// },
	headers: {
		// 'lang' : localStorage.getItem('i18nextLng'),
		// 'Accept': 'application/json',
		// 'Content-Type': 'application/json',
		'Accept-Language' : localStorage.getItem('i18nextLng') ? localStorage.getItem('i18nextLng') : 'id',
		// 'Access-Control-Allow-Origin': '*',
		// 'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
		// 'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept, Authorization"
	}
});