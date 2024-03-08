import axios from '../../../../config/axios';
import * as actionTypes from '../../../constants/vendor/konfirmasiTypes';

export const fetchKonfirmasi = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .get(`/vendor_management/vendor/${id}/check_document`)
                .then(res => {
                    resolve(res)
                    const response = res.data;
                    dispatch(
                        {type: actionTypes.SUCCESS_FETCH_KONFIRMASI, data: response.data, response: response}
                    )
                })
                .catch(error => {
                    reject(error.response);
                    const response = (typeof error.response !== 'object')
                        ? {}
                        : error.response;
                    dispatch({type: actionTypes.FAIL_FETCH_KONFIRMASI, response: response})
                })
            })
    }
}

export const submitKonfirmasi = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .post(`/vendor_management/vendor/${id}/submit`, payload)
                .then(res => {
                    resolve(res)
                    const response = res.data;
                    dispatch(
                        {type: actionTypes.SUCCESS_SUBMIT_KONFIRMASI, data: response.data, response: response}
                    )
                })
                .catch(error => {
                    reject(error.response);
                    const response = (typeof error.response !== 'object')
                        ? {}
                        : error.response;
                    dispatch({type: actionTypes.FAIL_SUBMIT_KONFIRMASI, response: response})
                })
            })
    }
}

export const cancelKonfirmasi = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .post(`/vendor_management/vendor/${id}/cancel`, payload)
                .then(res => {
                    resolve(res)
                    const response = res.data;
                    dispatch(
                        {type: actionTypes.SUCCESS_CANCEL_KONFIRMASI, data: response.data, response: response}
                    )
                })
                .catch(error => {
                    reject(error.response);
                    const response = (typeof error.response !== 'object')
                        ? {}
                        : error.response;
                    dispatch({type: actionTypes.FAIL_CANCEL_KONFIRMASI, response: response})
                })
            })
    }
}

export const fetchKonfirmasiVerifikasi = (verif_uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .get(`/vendor/verification/${verif_uuid}/confirmation/list`)
                .then(res => {
                    resolve(res)
                    const response = res.data;
                    dispatch(
                        {type: actionTypes.SUCCESS_FETCH_KONFIRMASI_VERIFIKASI, data: response.data, response: response}
                    )
                })
                .catch(error => {
                    reject(error.response);
                    const response = (typeof error.response !== 'object')
                        ? {}
                        : error.response;
                    dispatch({type: actionTypes.FAIL_FETCH_KONFIRMASI_VERIFIKASI, response: response})
                })
            })
    }
}

export const updateKonfirmasiVerifikasi = (verification, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .put(`/vendor/verification/${verification}`, payload)
                .then(res => {
                    resolve(res)
                    const response = res.data;
                    dispatch(
                        {type: actionTypes.SUCCESS_UPDATE_KONFIRMASI_VERIFIKASI, data: response.data, response: response}
                    )
                })
                .catch(error => {
                    reject(error.response);
                    const response = (typeof error.response !== 'object')
                        ? {}
                        : error.response;
                    dispatch({type: actionTypes.FAIL_UPDATE_KONFIRMASI_VERIFIKASI, response: response})
                })
            })
    }
}

export const setCollapseActive = response => {
	return dispatch => {
			if(response.type) {
					dispatch({type: actionTypes.SUCCESS_SET_COLLAPSE_ACTIVE, collapseActive: response.collapseActive});
				} else {
					dispatch({type: actionTypes.FAIL_SET_COLLAPSE_ACTIVE});
			}
	}
}