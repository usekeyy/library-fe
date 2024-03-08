import axios from '../../../../config/axios';
import * as actionTypes from '../../../constants/vendor/informasiLegalTypes';

export const fetchAkta = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${id}/akta_perusahaan`,{
						params: payload
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_FETCH_AKTA,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_FETCH_AKTA, response: response})
					})
			})   
	}
}

export const showAkta = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_id}/akta_perusahaan/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_AKTA,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_AKTA, response: response})
					})
			})   
	}
}

export const createAkta = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor_management/vendor/${id}/akta_perusahaan`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CREATE_AKTA,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CREATE_AKTA, response: response})
					})
			})   
	}
}

export const updateAkta = (vendor_id, id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${vendor_id}/akta_perusahaan/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_AKTA,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_AKTA, response: response})
					})
			})
	}
}

export const deleteAkta = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/vendor_management/vendor/${vendor_id}/akta_perusahaan/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_AKTA,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_AKTA, response: response})
					})
			})
	}
}

export const showNpwp = (id,parameter) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${id}/npwp`,{
						params: parameter
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_NPWP,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_NPWP, response: response})
					})
			})   
	}
}

export const updateNpwp = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${id}/npwp`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_NPWP,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_NPWP, response: response})
					})
			})
	}
}