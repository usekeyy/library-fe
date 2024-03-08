import axios from '../../../config/axios';
import * as actionTypes from '../../constants/storageLocationTypes';

export const fetchStorageLocation = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'storage_locations';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_STORAGE_LOCATION,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_STORAGE_LOCATION, response: response })
				});
		})
	}
}


export const saveStorageLocation = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/storage_locations', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_STORAGE_LOCATION,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_STORAGE_LOCATION, response: response})
					})
			})
	}
}

export const showStorageLocation = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/storage_locations/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_STORAGE_LOCATION,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_STORAGE_LOCATION, response: response})
					})
			})   
	}
}

export const updateStorageLocation = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/storage_locations/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_STORAGE_LOCATION,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_STORAGE_LOCATION, response: response})
					})
			})
	}
}

export const deleteStorageLocation = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/storage_locations/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_STORAGE_LOCATION,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_STORAGE_LOCATION, response: response})
					})
			})
	}
}