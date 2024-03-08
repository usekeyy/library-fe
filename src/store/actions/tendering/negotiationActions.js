import axios from '../../../config/axios';
import * as actionTypes from '../../constants/tendering/negotiationTypes';

export const showStepNegotiation = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/negotiation/${uuid}/tahap`)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SHOW_NEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SHOW_NEGOTIATION, response: error.response })
					});
			})
	}
}

export const showNegotiation = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/negotiation/${uuid}`)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SHOW_NEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SHOW_NEGOTIATION, response: error.response })
					});
			})
	}
}

export const saveNegotiation = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`tendering/proposal_tender/negotiation/create_tahap`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SAVE_NEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SAVE_NEGOTIATION, response: error.response })
					});
			})
	}
}

export const saveVendorNegotiation = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`tendering/proposal_tender/vendor_negotiation/${uuid}`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SAVE_VENDOR_NEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SAVE_VENDOR_NEGOTIATION, response: error.response })
					});
			})
	}
}

export const fetchVendorNegotiation = (params) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/negotiation`, {
						params: params
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_FETCH_NEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_FETCH_NEGOTIATION, response: error.response })
					});
			})
	}
}

export const showVendorNegotiation = (uuid, params) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/negotiation/${uuid}`, {
						params: params
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_FETCH_VENDOR_NEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_FETCH_VENDOR_NEGOTIATION, response: error.response })
					});
			})
	}
}

export const saveBuyerNegotiation = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`tendering/proposal_tender/buyer_negotiation/${uuid}`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SAVE_BUYER_NEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SAVE_BUYER_NEGOTIATION, response: error.response })
					});
			})
	}
}

export const saveReNegotiation = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`tendering/proposal_tender/buyer_negotiation/${uuid}`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SAVE_RENEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SAVE_RENEGOTIATION, response: error.response })
					});
			})
	}
}

export const downloadBAHN = (uuid, vendor_uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios({
						url: `tendering/proposal_tender/negotiation/${uuid}/${vendor_uuid}/download_ba`,
						method: 'GET',
						responseType: 'blob', // important
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DOWNLOAD_BAHN,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DOWNLOAD_BAHN, response: response})
					})
			})   
	}
}

export const downloadBidTabulation = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios({
						url: `tendering/proposal_tender/negotiation/${uuid}/download_bid_tabulation`,
						method: 'GET',
						responseType: 'blob', // important
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DOWNLOAD_BID_TABULATION,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DOWNLOAD_BID_TABULATION, response: response})
					})
			})   
	}
}

export const createAuction = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`tendering/create_auction/`+payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_CREATE_AUCTION_NEGOTIATION,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_CREATE_AUCTION_NEGOTIATION, response: error.response })
					});
			})
	}
}