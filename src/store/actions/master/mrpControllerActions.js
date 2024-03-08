import axios from '../../../config/axios';
import * as actionTypes from '../../constants/mrpControllerTypes';

export const fetchMrpController = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'mrp_controller';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_MRP_CONTROLLER,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_MRP_CONTROLLER, response: response })
				});
		})
	}
}


export const saveMrpController = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/mrp_controller', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_MRP_CONTROLLER,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_MRP_CONTROLLER, response: response})
					})
			})
	}
}

export const showMrpController = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/mrp_controller/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_MRP_CONTROLLER,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_MRP_CONTROLLER, response: response})
					})
			})   
	}
}

export const updateMrpController = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/mrp_controller/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_MRP_CONTROLLER,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_MRP_CONTROLLER, response: response})
					})
			})
	}
}

export const deleteMrpController = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/mrp_controller/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_MRP_CONTROLLER,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_MRP_CONTROLLER, response: response})
					})
			})
	}
}