import axios from '../../../config/axios';
import * as actionTypes from '../../constants/vendorAccGroupType';

export const fetchVendorAccGroup = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'vendor_acc_group';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_VENDOR_ACC_GROUP,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_VENDOR_ACC_GROUP, response: response })
				});
		})
	}
}


export const saveVendorAccGroup = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/vendor_acc_group', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_VENDOR_ACC_GROUP,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_VENDOR_ACC_GROUP, response: response})
					})
			})
	}
}

export const showVendorAccGroup = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_acc_group/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_VENDOR_ACC_GROUP,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_VENDOR_ACC_GROUP, response: response})
					})
			})   
	}
}

export const updateVendorAccGroup = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_acc_group/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_VENDOR_ACC_GROUP,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_VENDOR_ACC_GROUP, response: response})
					})
			})
	}
}

export const deleteVendorAccGroup = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/vendor_acc_group/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_VENDOR_ACC_GROUP,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_VENDOR_ACC_GROUP, response: response})
					})
			})
	}
}