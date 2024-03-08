import axios from '../../../../config/axios';
import * as actionTypes from '../../../constants/vendor/rekeningBankTypes';

// REKENING_BANK
export const fetchRekeningBank = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${id}/rekening_bank`,{
						params: payload
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_FETCH_REKENING_BANK,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_FETCH_REKENING_BANK, response: response})
					})
			})   
	}
}

export const showRekeningBank = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_id}/rekening_bank/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_REKENING_BANK,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_REKENING_BANK, response: response})
					})
			})   
	}
}

export const createRekeningBank = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor_management/vendor/${id}/rekening_bank`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CREATE_REKENING_BANK,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CREATE_REKENING_BANK, response: response})
					})
			})   
	}
}

export const updateRekeningBank = (vendor_id, id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${vendor_id}/rekening_bank/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_REKENING_BANK,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_REKENING_BANK, response: response})
					})
			})
	}
}

export const deleteRekeningBank = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/vendor_management/vendor/${vendor_id}/rekening_bank/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_REKENING_BANK,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_REKENING_BANK, response: response})
					})
			})
	}
}