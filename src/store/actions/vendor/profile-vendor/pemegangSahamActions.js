import axios from '../../../../config/axios';
import * as pemegangSahamTypes from '../../../constants/vendor/pemegangSahamTypes';

export const fetchPemegangSaham = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/vendor/${id}/saham`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pemegangSahamTypes.SUCCESS_FETCH_PEMEGANG_SAHAM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pemegangSahamTypes.FAIL_FETCH_PEMEGANG_SAHAM, response: error.response })
                });
        })
    }
}


export const showPemegangSaham = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + vendor_uuid + '/saham/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pemegangSahamTypes.SUCCESS_SHOW_PEMEGANG_SAHAM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pemegangSahamTypes.FAIL_SHOW_PEMEGANG_SAHAM, response: error.response })
                });
        })
    }
}

export const deletePemegangSaham = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor/' + vendor_uuid + '/saham/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pemegangSahamTypes.SUCCESS_DELETE_PEMEGANG_SAHAM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pemegangSahamTypes.FAIL_DELETE_PEMEGANG_SAHAM, response: error.response })
                });
        })
    }
}

export const savePemegangSaham = (vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor/' + vendor_uuid + '/saham', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pemegangSahamTypes.SUCCESS_SAVE_PEMEGANG_SAHAM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pemegangSahamTypes.FAIL_SAVE_PEMEGANG_SAHAM, response: error.response })
                });
        })
    }
}
export const updatePemegangSaham = (vendor_uuid, uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + vendor_uuid + '/saham/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pemegangSahamTypes.SUCCESS_UPDATE_PEMEGANG_SAHAM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pemegangSahamTypes.FAIL_UPDATE_PEMEGANG_SAHAM, response: error.response })
                });
        })
    }
}