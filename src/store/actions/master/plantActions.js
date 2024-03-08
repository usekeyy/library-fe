import axios from '../../../config/axios';
import * as actionTypes from '../../constants/plantTypes';

export const fetchPlant = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'plant';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_PLANT,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_PLANT, response: response })
				});
		})
	}
}


export const savePlant = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/plant', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_PLANT,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_PLANT, response: response})
					})
			})
	}
}

export const showPlant = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/plant/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_PLANT,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_PLANT, response: response})
					})
			})   
	}
}

export const updatePlant = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/plant/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_PLANT,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_PLANT, response: response})
					})
			})
	}
}

export const deletePlant = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/plant/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_PLANT,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_PLANT, response: response})
					})
			})
	}
}