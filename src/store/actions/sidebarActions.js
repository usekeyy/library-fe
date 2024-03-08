import axios from '../../config/axios';
// import axios from 'axios';
import * as actionTypes from '../constants/actionTypes';

export const sidebarAction = () => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			axios.get('menu')
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_SIDEBAR,
						data: response.data.data,
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_SIDEBAR, response: response })
				});
		})
	}
}

export const accessAction = (response) => {
	return dispatch => {
			if(response.type) {
					dispatch({ type: actionTypes.SUCCESS_FETCH_ACCESS, parent_access: response.parent_access, access: response.access, location: response.location });
			} else {
					dispatch({type: actionTypes.FAIL_FETCH_ACCESS});
			}
	}
}
