import axios from '../../../config/axios';
import * as actionTypes from '../../constants/postalCodeTypes';

export const fetchPostcalCode = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'postal_code';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_POSTCAL_CODE,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_POSTCAL_CODE, response: response })
				});
		})
	}
}

export const savePostcalCode = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/postal_code', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_POSTCAL_CODE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_POSTCAL_CODE, response: response})
					})
			})
	}
}

export const showPostcalCode = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/postal_code/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_POSTCAL_CODE,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_POSTCAL_CODE, response: response})
					})
			})   
	}
}

export const updatePostcalCode = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/postal_code/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_POSTCAL_CODE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_POSTCAL_CODE, response: response})
					})
			})
	}
}

export const deletePostcalCode = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/postal_code/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_POSTCAL_CODE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_POSTCAL_CODE, response: response})
					})
			})
	}
}