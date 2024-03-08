import axios from '../../../../config/axios';
import * as actionTypes from '../../../constants/vendor/profileVendorTypes';
import * as lastVerificationTypes from '../../../constants/vendor/verifikasiDataTypes';

export const fetchProfileVendor = (vendor_uuid, verification_uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_uuid}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_FETCH_PROFILE_VENDOR,
									data: response.data,
									response: response,
									vendor_uuid: vendor_uuid,
									verification_uuid: verification_uuid
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_FETCH_PROFILE_VENDOR, response: response})
					})
			})   
	}
}

export const vendorResponse = response => {
	return dispatch => {
			if(response.type) {
					dispatch({type: actionTypes.SUCCESS_FETCH_PROFILE_VENDOR});
					dispatch({type: lastVerificationTypes.SUCCESS_SHOW_LAST_VERIFIKASI});
				} else {
					dispatch({type: actionTypes.FAIL_FETCH_PROFILE_VENDOR});
					dispatch({type: lastVerificationTypes.FAIL_SHOW_LAST_VERIFIKASI});
			}
	}
}

export const showProfileVendor = (vendor_uuid,parameter) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_uuid}`,{
						params: parameter
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_PROFILE_VENDOR,
									data: response.data,
									response: response,
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_PROFILE_VENDOR, response: response})
					})
			})   
	}
}

export const updateProfileVendor = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_PROFILE_VENDOR,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_PROFILE_VENDOR, response: response})
					})
			})
	}
}

export const showVendorAddress = (id,parameter) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${id}/address`,{
						params: parameter
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_VENDOR_ADDRESS,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_VENDOR_ADDRESS, response: response})
					})
			})   
	}
}

export const updateVendorAddress = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${id}/address`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_VENDOR_ADDRESS,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_VENDOR_ADDRESS, response: response})
					})
			})
	}
}

export const showVendorSummary = (vendor_uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_uuid}/summary`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_VENDOR_SUMMARY,
									data: response.data,
									response: response,
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_VENDOR_SUMMARY, response: response})
					})
			})   
	}
}

export const downloadSLK = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios({
						url: `vendor_management/vendor/${uuid}/download_slk`,
						method: 'GET',
						responseType: 'blob', // important
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DOWNLOAD_SLK,
									data: response.data,
									response: response,
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DOWNLOAD_SLK, response: response})
					})
			})   
	}
}