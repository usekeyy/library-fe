import axios from '../../../config/axios';
import * as actionTypes from '../../constants/vendorTypes';

export const fetchVendorType = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'vendor_management/vendor_type';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_VENDOR_TYPE,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_VENDOR_TYPE, response: response })
				});
		})
	}
}


export const showVendorType = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get('vendor_management/vendor_type/' + id)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_SHOW_VENDOR_TYPE,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.FAIL_SHOW_VENDOR_TYPE, response: error.response })
							});
			})
	}
}

export const deleteVendorType = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete('vendor_management/vendor_type/' + id)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_DELETE_VENDOR_TYPE,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.FAIL_DELETE_VENDOR_TYPE, response: error.response })
							});
			})
	}
}

export const saveVendorType = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('vendor_management/vendor_type', payload)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_SAVE_VENDOR_TYPE,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.SUCCESS_SAVE_VENDOR_TYPE, response: error.response })
							});
			})
	}
}
export const updateVendorType = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put('vendor_management/vendor_type/' + id, payload)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_UPDATE_VENDOR_TYPE,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.SUCCESS_UPDATE_VENDOR_TYPE, response: error.response })
							});
			})
	}
}
