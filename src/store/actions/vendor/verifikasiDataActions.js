import axios from '../../../config/axios';
import * as actionTypes from '../../constants/vendor/verifikasiDataTypes';

export const fetchVerificationList = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`vendor/verification`, {
						params: payload
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_FETCH_VERIFIKASI_LIST_VENDOR,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_FETCH_VERIFIKASI_LIST_VENDOR, response: response})
					})
			})   
	}
}

export const showVerificationItem = (uuid, path, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor/verification/${uuid}/${path}`, {
						params: payload
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_VERIFIKASI_ITEM_VENDOR,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_VERIFIKASI_ITEM_VENDOR, response: response})
					})
			})   
	}
}

export const saveVerificationItem = (uuid, path, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor/verification/${uuid}/${path}`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_VERIFIKASI_ITEM_VENDOR,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_VERIFIKASI_ITEM_VENDOR, response: response})
					})
			})   
	}
}

export const saveVerificationLineItem = (uuid, item_uuid, path, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor/verification/${path}/${uuid}/${item_uuid}`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_VERIFIKASI_PER_LINE_ITEM_VENDOR,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_VERIFIKASI_PER_LINE_ITEM_VENDOR, response: response})
					})
			})   
	}
}

export const deleteVerificationLineItem = (uuid, item_uuid, path) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/vendor/verification/${path}/${uuid}/${item_uuid}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_VERIFIKASI_PER_LINE_ITEM_VENDOR,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_VERIFIKASI_PER_LINE_ITEM_VENDOR, response: response})
					})
			})   
	}
}

export const showLastVerification = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${uuid}/last_verification`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_LAST_VERIFIKASI,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_LAST_VERIFIKASI, response: response})
					})
			})   
	}
}

export const showLastVerificationForVerifikator = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${uuid}/last_verification`)
					.then(res => {
							resolve(res)
							const response = res.data;
							const obj = {
								// expired_in_day: response.expired_in_day,
								// has_draft_verification: response.has_draft_verification,
								status_vendor: response.status_vendor,
							}
							dispatch({
									type: actionTypes.SUCCESS_SHOW_LAST_VERIFIKASI,
									data: obj,
									response: obj
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_LAST_VERIFIKASI, response: response})
					})
			})   
	}
}

export const showLogHistory = (vendor_uuid, path, params) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor/verification/${vendor_uuid}/${path}/history`, {
						params: params
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_LOG_HISTORY_VERIFIKASI,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_LOG_HISTORY_VERIFIKASI, response: response})
					})
			})   
	}
}
