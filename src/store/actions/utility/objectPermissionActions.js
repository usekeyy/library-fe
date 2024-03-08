import axios from '../../../config/axios';
import * as actionTypes from '../../constants/actionTypes';

export const fetchObjectPermission = (id, payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			axios.get(`user/${id}/object_permission`, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_OBJECT_PERMISSION,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_OBJECT_PERMISSION, response: response })
				});
		})
	}
}


export const saveObjectPermission = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`user/${id}/object_permission`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_OBJECT_PERMISSION,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_OBJECT_PERMISSION, response: response})
					})
			})
	}
}