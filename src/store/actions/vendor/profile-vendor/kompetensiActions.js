import axios from '../../../../config/axios';
import * as kompetensiTypes from '../../../constants/vendor/kompetensiTypes';

export const fetchKompetensi = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/vendor/${id}/kompetensi`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: kompetensiTypes.SUCCESS_FETCH_KOMPETENSI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: kompetensiTypes.FAIL_FETCH_KOMPETENSI, response: error.response })
                });
        })
    }
}



export const showKompetensi = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + vendor_uuid + '/kompetensi/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: kompetensiTypes.SUCCESS_SHOW_KOMPETENSI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: kompetensiTypes.FAIL_SHOW_KOMPETENSI, response: error.response })
                });
        })
    }
}

export const deleteKompetensi = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor/' + vendor_uuid + '/kompetensi/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: kompetensiTypes.SUCCESS_DELETE_KOMPETENSI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: kompetensiTypes.FAIL_DELETE_KOMPETENSI, response: error.response })
                });
        })
    }
}

export const saveKompetensi = (vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor/' + vendor_uuid + '/kompetensi', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: kompetensiTypes.SUCCESS_SAVE_KOMPETENSI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: kompetensiTypes.FAIL_SAVE_KOMPETENSI, response: error.response })
                });
        })
    }
}
export const updateKompetensi = (vendor_uuid, uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + vendor_uuid + '/kompetensi/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: kompetensiTypes.SUCCESS_UPDATE_KOMPETENSI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: kompetensiTypes.FAIL_UPDATE_KOMPETENSI, response: error.response })
                });
        })
    }
}