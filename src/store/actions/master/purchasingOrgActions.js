import axios from '../../../config/axios';
import * as actionTypes from '../../constants/purchasingOrgTypes';

export const fetchPurchasingOrg = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'purchasing_org';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_PURCHASING_ORG,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_PURCHASING_ORG, response: response })
				});
		})
	}
}


export const savePurchasingOrg = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/purchasing_org', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_PURCHASING_ORG,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_PURCHASING_ORG, response: response})
					})
			})
	}
}

export const showPurchasingOrg = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/purchasing_org/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_PURCHASING_ORG,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_PURCHASING_ORG, response: response})
					})
			})   
	}
}

export const updatePurchasingOrg = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/purchasing_org/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_PURCHASING_ORG,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_PURCHASING_ORG, response: response})
					})
			})
	}
}

export const deletePurchasingOrg = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/purchasing_org/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_PURCHASING_ORG,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_PURCHASING_ORG, response: response})
					})
			})
	}
}