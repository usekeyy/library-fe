import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import Echo from 'laravel-echo';
import * as actionTypes from '../../constants/actionTypes';

require('pusher-js');
dotenvExpand(dotenv.config())

const options = {
	broadcaster: 'pusher',
	key: process.env.REACT_APP_PUSHER_APP_KEY,
	cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
	forceTLS: false,
	//authEndpoint is your apiUrl + /broadcasting/auth
	authEndpoint: process.env.REACT_APP_API_URL+'broadcast',
	// As I'm using JWT tokens, I need to manually set up the headers.
	// auth: {
	//   headers: {
	//     Authorization: `Bearer ${token}`,
	// 		'Accept': 'application/json',
	// 		'Access-Control-Allow-Methods': 'GET',
	//   },
	// },
};

export const fetchNotification = (user) => {
	return dispatch => {
		const echo = new Echo(options);
		const channel = echo.channel('my-channel');
		channel.listen('.my-event-'+user.uuid, (resp) => { 
				dispatch({
					type: actionTypes.SUCCESS_FETCH_NOTIFICATION,
					data: resp,
				})
				// console.log(resp)
		})
		echo.private(`App.User`).notification((data) => {
				// dispatch({
				// 	type: actionTypes.SUCCESS_FETCH_NOTIFICATION,
				// 	data: data,
				// })
				// console.log(data);
		});
	}
}