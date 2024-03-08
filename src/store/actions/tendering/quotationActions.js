import axios from '../../../config/axios';
import * as actionTypes from '../../constants/tendering/quotationTypes';

export const fetchVendorQuotation = (vendor_uuid, params) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/vendor_quotation/${vendor_uuid}`, {
						params: params
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_FETCH_VENDOR_QUOTATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_FETCH_VENDOR_QUOTATION, response: error.response })
					});
			})
	}
}

export const detailVendorQuotation = (vendor_uuid, params) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/vendor_quotation/${vendor_uuid}`, {
						params: params
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_GET_DETAIL_VENDOR_QUOTATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_GET_DETAIL_VENDOR_QUOTATION, response: error.response })
					});
			})
	}
}

export const submitVendorQuotation = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`tendering/quotation_proposal_tender/${uuid}`,payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SUBMIT_VENDOR_QUOTATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SUBMIT_VENDOR_QUOTATION, response: error.response })
					});
			})
	}
}

export const getVendorQuotation = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/quotation_proposal_tender/${uuid}`,payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_GET_VENDOR_QUOTATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_GET_VENDOR_QUOTATION, response: error.response })
					});
			})
	}
}

export const updateVendorQuotation = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`tendering/quotation_proposal_tender/${uuid}`,payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_VENDOR_QUOTATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_UPDATE_VENDOR_QUOTATION, response: error.response })
					});
			})
	}
}

export const submitRegisterVendorQuotation = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`tendering/registration_quotation_proposal_tender/${uuid}`,payload)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_SUBMIT_REGISTER_VENDOR_QUOTATION,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.FAIL_SUBMIT_REGISTER_VENDOR_QUOTATION, response: error.response })
							});
			})
	}
}

export const fetchPenawaranTerkirim = (uuid,params) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/penawaran_terkirim`,{
						params: params
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_FETCH_PENAWARAN_TERKIRIM,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_FETCH_PENAWARAN_TERKIRIM, response: error.response })
					});
			})
	}
}

export const detailPenawaranTerkirim = (vendor_uuid, params) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/vendor_quotation/${vendor_uuid}`, {
						params: params
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_FETCH_DETAIL_PENAWARAN_TERKIRIM,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_FETCH_DETAIL_PENAWARAN_TERKIRIM, response: error.response })
					});
			})
	}
}

export const getPenawaranTerkirimVendorQuotation = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/penawaran_terkirim_quotation_proposal_tender/${uuid}`,payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_GET_PENAWARAN_TERKIRIM_VENDOR_QUOTATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_GET_PENAWARAN_TERKIRIM_VENDOR_QUOTATION, response: error.response })
					});
			})
	}
}

export const findQuotationVendor = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/find_quotation_vendor`, {
						params: payload
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_FIND_QUOTATION_VENDOR,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_FIND_QUOTATION_VENDOR, response: error.response })
					});
			})
	}
}