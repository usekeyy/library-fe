import axios from '../../../config/axios';
import * as subBidangUsahaTypes from '../../constants/subBidangUsahaTypes';

export const fetchSubBidangUsaha = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sub_bidang_usaha', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subBidangUsahaTypes.SUCCESS_FETCH_SUB_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subBidangUsahaTypes.FAIL_FETCH_SUB_BIDANG_USAHA, response: error.response })
                });
        })
    }
}

export const showSubBidangUsaha = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sub_bidang_usaha/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subBidangUsahaTypes.SUCCESS_SHOW_SUB_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subBidangUsahaTypes.FAIL_SHOW_SUB_BIDANG_USAHA, response: error.response })
                });
        })
    }
}

export const deleteSubBidangUsaha = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/sub_bidang_usaha/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subBidangUsahaTypes.SUCCESS_DELETE_SUB_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subBidangUsahaTypes.FAIL_DELETE_SUB_BIDANG_USAHA, response: error.response })
                });
        })
    }
}

export const saveSubBidangUsaha = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/sub_bidang_usaha', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subBidangUsahaTypes.SUCCESS_SAVE_SUB_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subBidangUsahaTypes.FAIL_SAVE_SUB_BIDANG_USAHA, response: error.response })
                });
        })
    }
}
export const updateSubBidangUsaha = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/sub_bidang_usaha/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subBidangUsahaTypes.SUCCESS_UPDATE_SUB_BIDANG_USAHA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subBidangUsahaTypes.SUCCESS_UPDATE_SUB_BIDANG_USAHA, response: error.response })
                });
        })
    }
}
export const syncSubBidangUsaha = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/sync_sub_bidang_usaha', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: subBidangUsahaTypes.SUCCESS_SYNC_SUB_BIDANG_USAHA,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: subBidangUsahaTypes.FAIL_SYNC_SUB_BIDANG_USAHA, response: error.response })
						});
        })
    }
}
