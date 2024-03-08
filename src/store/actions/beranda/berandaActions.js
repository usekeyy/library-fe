import axios from '../../../config/axios';
import * as actionTypes from '../../constants/berandaTypes';

export const fetchCompany = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'vendor_management/company_type';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_COMPANY_TYPE,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_COMPANY_TYPE, response: response })
				});
		})
	}
}

export const fetchPurchasingOrg = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'purchasing_org';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_PURCHASING_ORG,
						data: response.data,
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

export const fetchCountry = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'country';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_COUNTRY,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_COUNTRY, response: response })
				});
		})
	}
}

export const fetchRegion = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'region';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_REGION,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_REGION, response: response })
				});
		})
	}
}

export const fetchDistrict = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'district';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_DISTRICT,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_DISTRICT, response: response })
				});
		})
	}
}

export const fetchVillage = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'villages';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_VILLAGE,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_VILLAGE, response: response })
				});
		})
	}
}

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

export const fetchSubDistrict = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'sub_district';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_SUB_DISTRICT,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_SUB_DISTRICT, response: response })
				});
		})
	}
}

export const fetchPostcalCode = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'postal_code';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_POSTCAL_CODE,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_POSTCAL_CODE, response: response })
				});
		})
	}
}

export const saveVendor = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/vendor_management/vendor', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_VENDOR,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_VENDOR, response: response})
					})
			})
	}
}

export const fetchTederUmum = (parameter) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get('tendering/public', {
							params: parameter
					})
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_FETCH_TENDER_UMUM,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.FAIL_FETCH_TENDER_UMUM, response: error.response })
							});
			})
	}
}