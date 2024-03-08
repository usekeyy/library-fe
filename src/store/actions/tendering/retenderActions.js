import axios from '../../../config/axios';
import * as actionTypes from '../../constants/tendering/retenderTypes';

export const fetchRetender = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/retender`, {
						params: payload
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_FETCH_RETENDER,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_FETCH_RETENDER, response: error.response })
					});
			})
	}
}
export const showRetender = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/retender/${uuid}`, {
						params: payload
					})
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SHOW_RETENDER,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SHOW_RETENDER, response: error.response })
					});
			})
	}
}

export const saveRetender = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`tendering/retender`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SAVE_RETENDER,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SAVE_RETENDER, response: error.response })
					});
			})
	}
}

export const approveRetender = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`tendering/retender/${uuid}`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_APPROVE_RETENDER,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_APPROVE_RETENDER, response: error.response })
					});
			})
	}
}

export const rejectRetender = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`tendering/retender/${uuid}`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_REJECT_RETENDER,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_REJECT_RETENDER, response: error.response })
					});
			})
	}
}

export const createRetenderItemize = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`tendering/retender_itemize`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_CREATE_RETENDER_ITEMIZE,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_CREATE_RETENDER_ITEMIZE, response: error.response })
					});
			})
	}
}

export const approveRetenderItemize = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`tendering/retender_itemize/${uuid}`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_APPROVE_RETENDER_ITEMIZE,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_APPROVE_RETENDER_ITEMIZE, response: error.response })
					});
			})
	}
}

export const showRetenderItemize = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/retender_itemize/${uuid}`, payload)
					.then(response => {
							resolve(response);
							dispatch({
									type: actionTypes.SUCCESS_SHOW_RETENDER_ITEMIZE,
									data: response.data
							})
					})
					.catch(error => {
							reject(error.response);
							dispatch({ type: actionTypes.FAIL_SHOW_RETENDER_ITEMIZE, response: error.response })
					});
			})
	}
}