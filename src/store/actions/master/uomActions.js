import axios from '../../../config/axios';
import * as actionTypes from '../../constants/uomTypes';

export const fetchUom = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'unit_of_measures';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_UOM,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_UOM, response: response })
				});
		})
	}
}


export const saveUom = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/unit_of_measures', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_UOM,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_UOM, response: response})
					})
			})
	}
}

export const showUom = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/unit_of_measures/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_UOM,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_UOM, response: response})
					})
			})   
	}
}

export const updateUom = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/unit_of_measures/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_UOM,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_UOM, response: response})
					})
			})
	}
}

export const deleteUom = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/unit_of_measures/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_UOM,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_UOM, response: response})
					})
			})
	}
}