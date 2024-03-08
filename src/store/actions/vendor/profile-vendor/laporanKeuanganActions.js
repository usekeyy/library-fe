import axios from '../../../../config/axios';
import * as actionTypes from '../../../constants/vendor/laporanKeuanganTypes';

// LAPORAN_NERACA
export const fetchLaporanNeraca = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${id}/laporan_neraca`,{
						params: payload
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_FETCH_LAPORAN_NERACA,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_FETCH_LAPORAN_NERACA, response: response})
					})
			})   
	}
}

export const showLaporanNeraca = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_id}/laporan_neraca/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_LAPORAN_NERACA,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_LAPORAN_NERACA, response: response})
					})
			})   
	}
}

export const createLaporanNeraca = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor_management/vendor/${id}/laporan_neraca`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CREATE_LAPORAN_NERACA,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CREATE_LAPORAN_NERACA, response: response})
					})
			})   
	}
}

export const updateLaporanNeraca = (vendor_id, id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${vendor_id}/laporan_neraca/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_LAPORAN_NERACA,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_LAPORAN_NERACA, response: response})
					})
			})
	}
}

export const deleteLaporanNeraca = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/vendor_management/vendor/${vendor_id}/laporan_neraca/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_LAPORAN_NERACA,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_LAPORAN_NERACA, response: response})
					})
			})
	}
}


// LAPORAN_LABA_RUGI
export const fetchLaporanLabaRugi = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${id}/laporan_laba_rugi`,{
						params: payload
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_FETCH_LAPORAN_LABA_RUGI,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_FETCH_LAPORAN_LABA_RUGI, response: response})
					})
			})   
	}
}

export const showLaporanLabaRugi = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_id}/laporan_laba_rugi/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_LAPORAN_LABA_RUGI,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_LAPORAN_LABA_RUGI, response: response})
					})
			})   
	}
}

export const createLaporanLabaRugi = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor_management/vendor/${id}/laporan_laba_rugi`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CREATE_LAPORAN_LABA_RUGI,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CREATE_LAPORAN_LABA_RUGI, response: response})
					})
			})   
	}
}

export const updateLaporanLabaRugi = (vendor_id, id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${vendor_id}/laporan_laba_rugi/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_LAPORAN_LABA_RUGI,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_LAPORAN_LABA_RUGI, response: response})
					})
			})
	}
}

export const deleteLaporanLabaRugi = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/vendor_management/vendor/${vendor_id}/laporan_laba_rugi/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_LAPORAN_LABA_RUGI,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_LAPORAN_LABA_RUGI, response: response})
					})
			})
	}
}

// LAPORAN_LAIN
export const fetchLaporanLain = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${id}/laporan_lain`,{
						params: payload
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_FETCH_LAPORAN_LAIN,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_FETCH_LAPORAN_LAIN, response: response})
					})
			})   
	}
}

export const showLaporanLain = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_id}/laporan_lain/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_LAPORAN_LAIN,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_LAPORAN_LAIN, response: response})
					})
			})   
	}
}

export const createLaporanLain = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor_management/vendor/${id}/laporan_lain`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CREATE_LAPORAN_LAIN,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CREATE_LAPORAN_LAIN, response: response})
					})
			})   
	}
}

export const updateLaporanLain = (vendor_id, id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${vendor_id}/laporan_lain/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_LAPORAN_LAIN,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_LAPORAN_LAIN, response: response})
					})
			})
	}
}

export const deleteLaporanLain = (vendor_id, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/vendor_management/vendor/${vendor_id}/laporan_lain/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_LAPORAN_LAIN,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_LAPORAN_LAIN, response: response})
					})
			})
	}
}