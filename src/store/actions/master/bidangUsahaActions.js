import axios from '../../../config/axios';
import * as bidangUsahaTypes from '../../constants/bidangUsahaTypes';

export const fetchBidangUsaha = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/bidang_usaha', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidangUsahaTypes.SUCCESS_FETCH_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidangUsahaTypes.FAIL_FETCH_BIDANG_USAHA, response: error.response })
                });
        })
    }
}

export const showBidangUsaha = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/bidang_usaha/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidangUsahaTypes.SUCCESS_SHOW_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidangUsahaTypes.FAIL_SHOW_BIDANG_USAHA, response: error.response })
                });
        })
    }
}

export const deleteBidangUsaha = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/bidang_usaha/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidangUsahaTypes.SUCCESS_DELETE_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidangUsahaTypes.FAIL_DELETE_BIDANG_USAHA, response: error.response })
                });
        })
    }
}

export const saveBidangUsaha = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/bidang_usaha', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidangUsahaTypes.SUCCESS_SAVE_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidangUsahaTypes.FAIL_SAVE_BIDANG_USAHA, response: error.response })
                });
        })
    }
}
export const updateBidangUsaha = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/bidang_usaha/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidangUsahaTypes.SUCCESS_UPDATE_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidangUsahaTypes.SUCCESS_UPDATE_BIDANG_USAHA, response: error.response })
                });
        })
    }
}
export const syncBidangUsaha = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/sync_bidang_usaha', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: bidangUsahaTypes.SUCCESS_SYNC_BIDANG_USAHA,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: bidangUsahaTypes.FAIL_SYNC_BIDANG_USAHA, response: error.response })
						});
        })
    }
}
